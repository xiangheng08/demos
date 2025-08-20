<script setup lang="ts">
import ViewportHTML from './ViewportHTML.vue'
import ViewportComponent from './ViewportComponent.vue'
import type { DemoConfig } from 'virtual:demos'

interface Props {
  demoConfig: DemoConfig
}

defineProps<Props>()
</script>

<template>
  <div class="viewport">
    <ViewportHTML v-if="demoConfig.type === 'html'" :demo-config="demoConfig" />
    <ViewportComponent v-else-if="demoConfig.type === 'component'" :demo-config="demoConfig" />
  </div>
</template>

<style lang="scss" scoped>
.viewport {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: var(--c-bg-alt);
}
</style>
