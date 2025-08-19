import { defineStore } from 'pinia'
import { ref, computed, reactive } from 'vue'
import { configs } from 'virtual:demos'
import { useAppearance } from '@/hooks/appearance'
import type { DemoConfig } from 'virtual:demos'

export const useAppStore = defineStore('App', () => {
  const windowWidth = ref(window.innerWidth)
  const isMobile = computed(() => windowWidth.value < 768)
  const demoConfigs = reactive(configs)
  const currentDemoConfig = ref<DemoConfig | null>(demoConfigs[0])

  window.addEventListener('resize', () => {
    windowWidth.value = window.innerWidth
  })

  return { windowWidth, isMobile, demoConfigs, currentDemoConfig, ...useAppearance() }
})
