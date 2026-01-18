<script setup lang="ts">
// Layout handles the global structure: Config Panel (Left) + Print Preview (Right)
</script>

<template>
  <main class="bg-gray-100 flex flex-col h-screen w-screen overflow-hidden dark:bg-gray-900 md:flex-row">
    <!-- Left Sidebar: Config Panel -->
    <aside class="border-r border-gray-200 bg-white flex-shrink-0 w-full transition-transform z-10 overflow-y-auto dark:border-gray-700 dark:bg-gray-800 md:w-80 print:hidden">
      <ConfigPanel />
    </aside>

    <!-- Right Content: Preview Area -->
    <section class="p-4 bg-gray-100 flex flex-1 items-start justify-center relative overflow-auto dark:bg-gray-900">
      <div class="mx-auto h-full max-w-[210mm] w-full">
        <slot />
      </div>
    </section>
  </main>
</template>

<style>
@media print {
  body {
    background: white;
  }
  @page {
    margin: 0;
  }

  /* Reset layout constraints for print */
  main {
    height: auto !important;
    overflow: visible !important;
    display: block !important;
  }

  section {
    overflow: visible !important;
    height: auto !important;
    padding: 0 !important;
    display: block !important;
  }
}
</style>
