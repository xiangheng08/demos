import { defineStore } from 'pinia'
import { ref, computed, reactive, watch } from 'vue'
import { configs } from 'virtual:demos'
import { useAppearance } from '@/hooks/appearance'
import type { DemoConfig } from 'virtual:demos'

export const useAppStore = defineStore('App', () => {
  const windowWidth = ref(window.innerWidth)
  const isMobile = computed(() => windowWidth.value < 768)
  const demoConfigs = reactive(configs)
  const currentDemoConfig = ref<DemoConfig | null>(null)

  window.addEventListener('resize', () => {
    windowWidth.value = window.innerWidth
  })

  watch(currentDemoConfig, () => {
    if (currentDemoConfig.value) {
      // 改变 url，加上 id 参数
      window.history.replaceState(null, '', `?id=${currentDemoConfig.value.id}`)
    } else {
      window.history.replaceState(null, '', '/')
    }
  })

  // 从url中获取id
  const query = new URLSearchParams(window.location.search)
  const id = query.get('id')
  if (id) {
    const demoConfig = demoConfigs.find((demoConfig) => demoConfig.id === id)
    if (demoConfig) {
      currentDemoConfig.value = demoConfig
    } else {
      window.history.replaceState(null, '', '/')
    }
  }

  return { windowWidth, isMobile, demoConfigs, currentDemoConfig, ...useAppearance() }
})
