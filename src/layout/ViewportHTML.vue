<script setup lang="ts">
import { ref } from 'vue'
import type { DemoConfigAsHTML } from 'virtual:demos'

interface Props {
  demoConfig: DemoConfigAsHTML
}
const props = defineProps<Props>()

const iframeRef = ref<HTMLIFrameElement>()

if (import.meta.hot) {
  import.meta.hot.on('demos:html-demo-changed', (data) => {
    // 当前 html demo 文件发生改变
    if (data.id === props.demoConfig.id && iframeRef.value && iframeRef.value.contentWindow) {
      iframeRef.value.contentWindow.location.reload()
    }
  })
}
</script>

<template>
  <iframe ref="iframeRef" class="html-demo" :src="demoConfig.html"></iframe>
</template>

<style lang="scss" scoped>
.html-demo {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
