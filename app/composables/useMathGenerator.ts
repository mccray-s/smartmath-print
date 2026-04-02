import type { MathConfig, MathQuestion, Operator } from '~/types'
import { v4 as uuidv4 } from 'uuid'

export function useMathGenerator() {
  function generateQuestions(config: MathConfig): MathQuestion[] {
    const list: MathQuestion[] = []
    const seenSignatures = new Set<string>()
    const targetCount = Math.max(1, Number((config.layout as any).pageCount) || 100)
    const maxUniqueAttempts = targetCount * 50
    let uniqueAttempts = 0

    // First pass: prefer unique questions.
    while (list.length < targetCount && uniqueAttempts < maxUniqueAttempts) {
      uniqueAttempts++
      const q = generateSingleQuestion(config)
      if (!q)
        continue

      const signature = `${q.terms.join(',')}|${q.operators.join(',')}|${q.hideTermIndex}`
      if (seenSignatures.has(signature))
        continue

      seenSignatures.add(signature)
      list.push(q)
    }

    // Second pass: when rules are strict and unique pool is exhausted, allow duplicates to fill pages.
    const maxFillAttempts = targetCount * 100
    let fillAttempts = 0
    while (list.length < targetCount && fillAttempts < maxFillAttempts) {
      fillAttempts++
      const q = generateSingleQuestion(config)
      if (q)
        list.push(q)
    }

    return list
  }

  function generateSingleQuestion(config: MathConfig): MathQuestion | null {
    const { logic } = config

    if (logic.operators.length === 0)
      return null

    // Determine how many operators we need
    // termCount = 2 -> 1 operator
    // termCount = 3 -> 2 operators
    const termCount = logic.termCount || 2
    const opCount = termCount - 1

    const ops: Operator[] = []
    for (let i = 0; i < opCount; i++) {
      const randomOp = logic.operators[Math.floor(Math.random() * logic.operators.length)]
      if (randomOp) {
        ops.push(randomOp)
      }
    }

    // Try multiple times to generate a valid question for these operators
    for (let i = 0; i < 10; i++) {
      const q = tryCreate(ops, config)
      if (q)
        return q
    }

    return null
  }

  function tryCreate(ops: Operator[], config: MathConfig): MathQuestion | null {
    const { logic } = config
    const [min, max] = logic.range

    const terms: number[] = []

    // Generate first term
    const firstTerm = getRandomInt(min, max)
    terms.push(firstTerm)

    // Initialize result with the first term
    let result = firstTerm
    let isCarry = false
    let isBorrow = false

    // Iteratively generate and compute
    for (let i = 0; i < ops.length; i++) {
      const op = ops[i]
      const prevRes = result

      let nextTerm = getRandomInt(min, max)

      // Special logic for Division to ensure integer result
      if (op === '÷') {
        if (nextTerm === 0)
          nextTerm = 1
        if (prevRes % nextTerm !== 0) {
          return null
        }
      }

      // Special logic for Subtraction (No Negative)
      if (op === '-') {
        // If allowNegative is false and nextTerm > prevRes (which is current result)
        if (!logic.allowNegative && nextTerm > prevRes) {
          if (i === 0) {
            // Swap terms[0] and nextTerm
            if (terms[0] !== undefined) {
              const temp = terms[0]
              terms[0] = nextTerm
              nextTerm = temp
              // Must update result since it was initialized to terms[0]
              result = terms[0]
            }
          }
          else {
            return null
          }
        }
      }

      // Special logic for + Carry / - Borrow checks
      if (op === '+') {
        const aUnit = result % 10
        const bUnit = nextTerm % 10
        const stepCarry = (aUnit + bUnit) >= 10
        if (stepCarry)
          isCarry = true

        if (logic.addCarryRule === 'force' && !stepCarry)
          return null
        if (logic.addCarryRule === 'none' && stepCarry)
          return null
      }
      else if (op === '-') {
        const aUnit = result % 10
        const bUnit = nextTerm % 10
        const stepBorrow = aUnit < bUnit
        if (stepBorrow)
          isBorrow = true

        if (logic.subBorrowRule === 'force' && !stepBorrow)
          return null
        if (logic.subBorrowRule === 'none' && stepBorrow)
          return null
      }

      // Perform calculation
      if (op === '+')
        result += nextTerm
      else if (op === '-')
        result -= nextTerm
      else if (op === '×')
        result *= nextTerm
      else if (op === '÷')
        result /= nextTerm

      terms.push(nextTerm)
    }

    // --- Final Validation ---

    // 1. Result Range Check (New)
    if (logic.resultRange) {
      const [rMin, rMax] = logic.resultRange
      if (result < rMin || result > rMax)
        return null
    }

    // 2. Negative Result Check (Existing)
    if (!logic.allowNegative && result < 0)
      return null

    // Construct Display Strings
    let displayStr = ''
    let answerStr = ''
    let hideIdx: number | undefined

    if (logic.missingPosition === 'result') {
      // e.g. "1 + 2 + 3 ="
      let leftSide = `${terms[0]}`
      for (let k = 0; k < ops.length; k++) {
        leftSide += ` ${ops[k]} ${terms[k + 1]}`
      }
      displayStr = `${leftSide} =`
      answerStr = `${result}`
    }
    else {
      // Hide one random operand
      // We have terms[0]...terms[ops.length]
      // Pick random index to hide
      hideIdx = Math.floor(Math.random() * terms.length)
      const answerVal = terms[hideIdx]

      // Rebuild string with ( ) for blank to be clearer
      const blankSymbol = '( )'

      let leftSideHidden = ''
      if (hideIdx === 0)
        leftSideHidden = blankSymbol
      else leftSideHidden = `${terms[0]}`

      for (let k = 0; k < ops.length; k++) {
        const nextT = (k + 1 === hideIdx) ? blankSymbol : terms[k + 1]
        leftSideHidden += ` ${ops[k]} ${nextT}`
      }

      displayStr = `${leftSideHidden} = ${result}`
      answerStr = `${answerVal}`
    }

    return {
      id: uuidv4(),
      terms,
      operators: ops,
      result,
      displayStr,
      answerStr,
      isCarry,
      isBorrow,
      hideTermIndex: logic.missingPosition === 'operand' ? hideIdx : undefined,
    }
  }

  function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  return {
    generateQuestions,
  }
}
