import type { MathConfig, MathQuestion } from '~/types'
import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

export const useMathStore = defineStore('math', () => {
  // Persist config to localStorage
  const config = useStorage<MathConfig>('math-config', {
    layout: {
      columns: 3,
      fontSize: 'md',
      showAnswers: false,
      totalPages: 1,
      horizontalGap: 4,
      verticalGap: 4,
    },
    logic: {
      operators: ['+', '-'],
      range: [1, 50],
      resultRange: [1, 50], // Default result limit
      allowNegative: false,
      addCarryRule: 'random',
      subBorrowRule: 'random',
      termCount: 2,
      missingPosition: 'result',
    },
  })

  // State for generated questions
  const questions = ref<MathQuestion[]>([])

  const questionsPerPage = computed(() => {
    // Precise calculation based on the new @page layout
    // A4 Height: 297mm
    // Padding (Top 20mm + Bottom 20mm) = 40mm (Strictly defined in CSS)
    // Header Content Height ≈ 35mm
    // Footer Content Height ≈ 15mm
    // Total occupied height = 40 + 35 + 15 = 90mm
    // Available for Grid = 297 - 90 = 207mm
    const availableHeightMm = 207

    // Row Height Estimate:
    // Base font height varies by size
    let baseFontMm = 6
    if (config.value.layout.fontSize === 'sm')
      baseFontMm = 5
    if (config.value.layout.fontSize === 'lg')
      baseFontMm = 8

    // Gap: verticalGap * 1.8 (Reduced multiplier for tighter packing)
    const gapMm = config.value.layout.verticalGap * 1.8
    const rowHeightMm = baseFontMm + gapMm

    const rows = Math.floor(availableHeightMm / rowHeightMm) - 1

    // Ensure at least 1 row
    const actualRows = Math.max(1, rows)

    return actualRows * config.value.layout.columns
  })

  // Actions
  function generate() {
    // Logic will be imported from useMathGenerator
    const { generateQuestions } = useMathGenerator()
    // Temp override pageCount for generator
    const totalQuestions = questionsPerPage.value * config.value.layout.totalPages

    // Create a temporary config for the generator
    const genConfig = {
      ...config.value,
      layout: {
        ...config.value.layout,
        pageCount: totalQuestions,
      },
    }
    questions.value = generateQuestions(genConfig)
  }

  // Auto-regenerate when quantity requirements change
  watch(
    [() => config.value.layout.totalPages, questionsPerPage],
    () => {
      generate()
    },
  )

  return {
    config,
    questions,
    questionsPerPage,
    generate,
  }
})
