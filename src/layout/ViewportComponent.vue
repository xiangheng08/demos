<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import type { DemoConfigAsComponent } from 'virtual:demos'

interface Props {
  demoConfig: DemoConfigAsComponent
}
const props = defineProps<Props>()

const DemoComponent = defineAsyncComponent(props.demoConfig.component)
</script>

<template>
  <DemoComponent />
</template>
