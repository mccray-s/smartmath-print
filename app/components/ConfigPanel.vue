<script setup lang="ts">
const mathStore = useMathStore()
const { config } = storeToRefs(mathStore)

// Options for selects
const fontSizes = [
  { label: '小', value: 'sm' },
  { label: '中', value: 'md' },
  { label: '大', value: 'lg' },
]
const columns = [2, 3, 4]

function applyPreset(max: number, terms: 2 | 3) {
  // Reset basic logic
  config.value.logic.operators = ['+', '-']
  config.value.logic.termCount = terms

  // Apply ranges
  config.value.logic.range = [1, max]
  if (!config.value.logic.resultRange) {
    config.value.logic.resultRange = [1, max]
  }
  else {
    config.value.logic.resultRange = [1, max]
  }

  // Optional: Set default rules for presets
  config.value.logic.allowNegative = false
  config.value.logic.addCarryRule = 'random'
  config.value.logic.subBorrowRule = 'random'
}
</script>

<template>
  <div class="text-gray-700 bg-white flex flex-col h-full dark:text-gray-200 dark:bg-gray-800">
    <div class="p-4 border-b border-gray-200 bg-gray-50 top-0 sticky z-10 dark:border-gray-700 dark:bg-gray-900">
      <h2 class="text-xl font-bold flex gap-2 items-center">
        <div class="i-carbon-settings" />
        题目配置
      </h2>
    </div>

    <div class="p-4 flex-1 overflow-y-auto space-y-6">
      <!-- Layout Section -->
      <section>
        <h3 class="text-sm text-gray-400 tracking-wider font-semibold mb-3 uppercase">
          排版设置
        </h3>
        <div class="space-y-4">
          <div class="gap-4 grid grid-cols-2">
            <label class="block">
              <div class="mb-1 flex items-center justify-between">
                <span class="text-sm">打印页数</span>
                <span class="text-[10px] text-primary font-mono px-1 rounded bg-blue-50">
                  {{ mathStore.questionsPerPage }}题/页
                </span>
              </div>
              <div class="relative">
                <input v-model.number="config.layout.totalPages" type="number" min="1" max="50" class="p-1 border border-gray-300 rounded bg-transparent w-full dark:border-gray-600">
              </div>
            </label>
            <label class="block">
              <span class="text-sm mb-1 block">列数</span>
              <select v-model="config.layout.columns" class="p-1 border border-gray-300 rounded bg-transparent w-full dark:border-gray-600">
                <option v-for="n in columns" :key="n" :value="n">{{ n }}列</option>
              </select>
            </label>
          </div>

          <label class="block">
            <span class="text-sm mb-1 block">字体大小</span>
            <div class="p-1 rounded bg-gray-100 flex dark:bg-gray-900">
              <button
                v-for="opt in fontSizes"
                :key="opt.value"
                class="text-sm py-1 rounded flex-1 transition-colors"
                :class="config.layout.fontSize === opt.value ? 'bg-white dark:bg-gray-700 shadow text-primary' : 'text-gray-500'"
                @click="config.layout.fontSize = opt.value as any"
              >
                {{ opt.label }}
              </button>
            </div>
          </label>
          <!-- Gaps -->
          <div class="gap-4 grid grid-cols-2">
            <label>
              <div class="mb-1 flex justify-between">
                <span class="text-sm">行间距 ({{ config.layout.verticalGap }})</span>
                <span class="text-xs text-primary font-bold">每页约 {{ mathStore.questionsPerPage }} 题</span>
              </div>
              <input v-model.number="config.layout.verticalGap" type="range" min="2" max="10" class="appearance-none rounded-lg bg-gray-200 h-2 w-full cursor-pointer dark:bg-gray-700">
            </label>
            <label>
              <span class="text-sm mb-1 block">列间距 ({{ config.layout.horizontalGap }})</span>
              <input v-model.number="config.layout.horizontalGap" type="range" min="2" max="12" class="w-full">
            </label>
          </div>

          <label class="mt-4 p-2 border border-gray-100 rounded bg-gray-50 flex items-center justify-between dark:border-gray-700 dark:bg-gray-800">
            <span class="text-sm font-medium">显示参考答案页</span>
            <input v-model="config.layout.showAnswers" type="checkbox" class="accent-blue-600 rounded h-5 w-5 cursor-pointer">
          </label>
        </div>
      </section>

      <hr class="border-gray-200 dark:border-gray-700">

      <!-- Logic Section -->
      <section>
        <h3 class="text-sm text-gray-400 tracking-wider font-semibold mb-3 uppercase">
          数学规则
        </h3>

        <!-- Presets -->
        <div class="mb-6 gap-2 grid grid-cols-2">
          <button
            class="text-xs text-gray-600 px-1 py-2 border rounded bg-white transition dark:text-gray-300 dark:border-gray-600 dark:bg-gray-800 hover:bg-gray-50"
            @click="applyPreset(20, 2)"
          >
            20以内加减
          </button>
          <button
            class="text-xs text-gray-600 px-1 py-2 border rounded bg-white transition dark:text-gray-300 dark:border-gray-600 dark:bg-gray-800 hover:bg-gray-50"
            @click="applyPreset(20, 3)"
          >
            20以内连加减
          </button>
          <button
            class="text-xs text-gray-600 px-1 py-2 border rounded bg-white transition dark:text-gray-300 dark:border-gray-600 dark:bg-gray-800 hover:bg-gray-50"
            @click="applyPreset(30, 2)"
          >
            30以内加减
          </button>
          <button
            class="text-xs text-gray-600 px-1 py-2 border rounded bg-white transition dark:text-gray-300 dark:border-gray-600 dark:bg-gray-800 hover:bg-gray-50"
            @click="applyPreset(30, 3)"
          >
            30以内连加减
          </button>
        </div>

        <div class="space-y-4">
          <!-- Operators -->
          <div>
            <span class="text-sm mb-2 block">运算符</span>
            <div class="flex gap-2">
              <label
                v-for="op in ['+', '-', '×', '÷']"
                :key="op"
                class="px-3 py-1 border rounded flex gap-2 cursor-pointer transition-colors items-center hover:bg-gray-50 dark:hover:bg-gray-700"
                :class="config.logic.operators.includes(op as any) ? 'border-primary text-primary bg-primary/10' : 'border-gray-300 dark:border-gray-600'"
              >
                <input v-model="config.logic.operators" type="checkbox" :value="op" class="hidden">
                <span class="text-lg font-bold font-mono">{{ op }}</span>
              </label>
            </div>
          </div>

          <!-- Missing Position (Moved Up) -->
          <div>
            <span class="text-sm text-gray-500 mb-1 block">填空位置</span>
            <div class="p-1 rounded bg-gray-100 flex dark:bg-gray-900">
              <button
                class="text-xs py-1 rounded flex-1 transition-colors"
                :class="config.logic.missingPosition === 'result' ? 'bg-white shadow text-primary' : 'text-gray-500'"
                @click="config.logic.missingPosition = 'result'"
              >
                求结果
              </button>
              <button
                class="text-xs py-1 rounded flex-1 transition-colors"
                :class="config.logic.missingPosition === 'operand' ? 'bg-white shadow text-primary' : 'text-gray-500'"
                @click="config.logic.missingPosition = 'operand'"
              >
                求运算项
              </button>
            </div>
          </div>

          <!-- Operand Range -->
          <div class="gap-2 grid grid-cols-2">
            <label>
              <span class="text-sm text-gray-500">运算数范围 (Min)</span>
              <input v-model.number="config.logic.range[0]" type="number" class="p-1 border rounded bg-transparent w-full">
            </label>
            <label>
              <span class="text-sm text-gray-500">运算数范围 (Max)</span>
              <input v-model.number="config.logic.range[1]" type="number" class="p-1 border rounded bg-transparent w-full">
            </label>
          </div>

          <!-- Result Range -->
          <div class="gap-2 grid grid-cols-2">
            <label>
              <span class="text-sm text-gray-500">结果范围 (Min)</span>
              <input v-if="config.logic.resultRange" v-model.number="config.logic.resultRange[0]" type="number" class="p-1 border rounded bg-transparent w-full">
            </label>
            <label>
              <span class="text-sm text-gray-500">结果范围 (Max)</span>
              <input v-if="config.logic.resultRange" v-model.number="config.logic.resultRange[1]" type="number" class="p-1 border rounded bg-transparent w-full">
            </label>
          </div>

          <!-- Term Count -->
          <div>
            <span class="text-sm text-gray-500 mb-1 block">运算项数</span>
            <div class="p-1 rounded bg-gray-100 flex dark:bg-gray-900">
              <button
                class="text-xs py-1 rounded flex-1 transition-colors"
                :class="config.logic.termCount === 2 ? 'bg-white shadow text-primary' : 'text-gray-500'"
                @click="config.logic.termCount = 2"
              >
                2 项
              </button>
              <button
                class="text-xs py-1 rounded flex-1 transition-colors"
                :class="config.logic.termCount === 3 ? 'bg-white shadow text-primary' : 'text-gray-500'"
                @click="config.logic.termCount = 3"
              >
                3 项 (连加减)
              </button>
            </div>
          </div>

          <!-- Advanced Rules -->
          <div class="pt-2 space-y-3">
            <label class="flex items-center justify-between">
              <span class="text-sm">允许负数结果</span>
              <input v-model="config.logic.allowNegative" type="checkbox" class="accent-primary rounded">
            </label>

            <div v-if="config.logic.operators.includes('+')">
              <span class="text-sm text-gray-500 mb-1 block">加法进位</span>
              <select v-model="config.logic.addCarryRule" class="text-sm p-1 border rounded bg-transparent w-full">
                <option value="random">
                  随机
                </option>
                <option value="force">
                  强制进位
                </option>
                <option value="none">
                  不进位
                </option>
              </select>
            </div>

            <div v-if="config.logic.operators.includes('-')">
              <span class="text-sm text-gray-500 mb-1 block">减法退位</span>
              <select v-model="config.logic.subBorrowRule" class="text-sm p-1 border rounded bg-transparent w-full">
                <option value="random">
                  随机
                </option>
                <option value="force">
                  强制借位
                </option>
                <option value="none">
                  不借位
                </option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <!-- Actions -->
      <section class="pb-8">
        <button
          class="text-white font-bold py-3 rounded bg-blue-600 flex gap-2 w-full shadow-lg transition-transform items-center justify-center hover:bg-blue-700 active:scale-95"
          @click="mathStore.generate()"
        >
          <div class="i-carbon-renew" />
          刷新题目
        </button>

        <button
          onclick="window.print()"
          class="font-semibold mt-4 py-3 border border-gray-300 rounded flex gap-2 w-full transition-colors items-center justify-center dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <div class="i-carbon-printer" />
          打印预览
        </button>
      </section>
    </div>
  </div>
</template>
