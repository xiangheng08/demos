import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app'

export const useApp = () => {
  const store = useAppStore()
  return { ...store, ...storeToRefs(store) }
}
