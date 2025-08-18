<script setup lang="ts">
import { configs } from 'virtual:demos'

configs.forEach((config) => {
  if (config.type === 'component') {
    console.log(config)

    config
      .importFn()
      .then((module) => {
        console.log(`Component loaded: ${config.component}`, module)
      })
      .catch((error) => {
        console.error(`Error loading component ${config.component}:`, error)
      })
  }
})
</script>

<template>
  <h1>You did it!</h1>
  {{ configs }}
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
</template>

<style scoped></style>
