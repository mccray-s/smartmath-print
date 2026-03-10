export type Operator = '+' | '-' | '×' | '÷'

export interface MathConfig {
  layout: {
    columns: number // 2 | 3 | 4
    fontSize: 'sm' | 'md' | 'lg'
    showAnswers: boolean
    totalPages: number
    horizontalGap: number
    verticalGap: number
    studentName: string
  }
  logic: {
    operators: Operator[]
    range: [number, number]
    resultRange?: [number, number] // Optional result range limit
    allowNegative: boolean
    addCarryRule: 'random' | 'none' | 'force'
    subBorrowRule: 'random' | 'none' | 'force'
    termCount: 2 | 3
    missingPosition: 'result' | 'operand'
  }
}

export interface MathQuestion {
  id: string
  terms: number[]
  operators: Operator[]
  result: number
  displayStr: string
  answerStr: string
  isCarry?: boolean
  isBorrow?: boolean
  hideTermIndex?: number
}
