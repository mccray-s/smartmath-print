<script setup lang="ts">
import { appName } from '~/constants'

useHead({
  title: appName,
})
</script>

<template>
  <VitePwaManifest />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
html,
body,
#__nuxt {
  padding: 0;
}

@media print {
  html,
  body,
  #__nuxt {
    height: auto !important;
    overflow: visible !important;
  }
}

html.dark {
  color-scheme: dark;
}
</style>
