import { computed, ref, watchEffect } from 'vue'

export type Appearance = 'auto' | 'light' | 'dark'

export const appearances = ['auto', 'light', 'dark'] as const

interface AppearanceOptions {
  defaultValue: Appearance
  storageKey: string
}

export const useAppearance = (options?: AppearanceOptions) => {
  const { defaultValue = 'auto', storageKey = 'appearance' } = options || {}

  const query = window.matchMedia('(prefers-color-scheme: dark)')
  const isSystemDark = ref(query.matches)

  query.addEventListener('change', () => {
    isSystemDark.value = query.matches
  })

  const appearance = ref(getAppearance(storageKey, defaultValue))

  const isDark = computed(() => {
    switch (appearance.value) {
      case 'dark':
        return true
      case 'light':
        return false
      default:
        return isSystemDark.value
    }
  })

  const isLight = computed(() => !isDark.value)

  watchEffect(() => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
    }
  })

  return { appearance, isDark, isLight }
}

const getAppearance = (storageKey: string, defaultTheme: Appearance): Appearance => {
  const value = localStorage.getItem(storageKey) as any
  return appearances.includes(value) ? value : defaultTheme
}
