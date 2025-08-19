<script setup lang="ts">
import type { DemoConfigAsHTML } from 'virtual:demos'

interface Props {
  demoConfig: DemoConfigAsHTML
}
defineProps<Props>()
</script>

<template>
  <iframe class="html-demo" :src="'./' + demoConfig.html"></iframe>
</template>

<style lang="scss" scoped>
.html-demo {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
