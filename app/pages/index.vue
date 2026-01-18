<script setup lang="ts">
definePageMeta({
  layout: 'default',
})
</script>

<template>
  <div class="h-full w-full">
    <!-- Main content is handled by the layout (Preview Area) -->
    <!-- This page might eventually hold specific routed content or just be empty if everything is in layout -->
    <PrintPreview />
  </div>
</template>
