<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'

interface Props {
  keyword: string
}
const props = defineProps<Props>()

const emit = defineEmits(['update:keyword', 'down', 'up', 'enter'])

const innerKeyword = computed({
  get() {
    return props.keyword
  },
  set(value: string) {
    emit('update:keyword', value)
  },
})
const isFocus = ref(false)
const inputRef = ref<HTMLInputElement>()

const focus = () => {
  inputRef.value?.focus()
}

const blur = () => {
  inputRef.value?.blur()
  innerKeyword.value = ''
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key === 'k') {
    e.preventDefault()
    focus()
  }
}

const handleInputKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    blur()
  } else if (e.key === 'Enter') {
    blur()
    emit('enter')
  } else if (e.key === 'ArrowUp') {
    emit('up')
  } else if (e.key === 'ArrowDown') {
    emit('down')
  }
}

const handleInputFocus = () => {
  isFocus.value = true
  innerKeyword.value = ''
}

const handleInputBlur = () => {
  isFocus.value = false
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <button class="search-button" :class="{ focus: isFocus }" @click="focus">
    <span class="icon">
      <SearchIcon />
    </span>
    <input
      type="search"
      class="search-input"
      placeholder="搜索 Demo"
      ref="inputRef"
      @focus="handleInputFocus"
      @blur="handleInputBlur"
      @keydown="handleInputKeydown"
      v-model="innerKeyword"
    />
    <span class="keys">Ctrl K</span>
  </button>
</template>

<style lang="scss" scoped>
.search-button {
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 8px 0 10px;
  border-radius: 8px;
  border-width: 1px;
  border-style: solid;
  border-color: var(--c-border);
  transition: border-color 0.2s ease-in-out;
  background-color: var(--c-bg-alt);
  color: var(--c-text-2);
  overflow: hidden;
  &:hover,
  &.focus {
    border-color: var(--c-brand-1);
  }

  &.focus {
    .search-input {
      width: 194px;
    }
    .keys {
      display: none;
    }
  }

  .icon {
    font-size: 14px;
    display: block;
    width: 1em;
    height: 1em;
    margin-right: 8px;
  }

  .search-input {
    width: 75px;
    font-size: 13px;
    display: block;
    height: 100%;
    background-color: transparent;
    border: none;
    outline: none;
    transition: width 0.2s ease-in-out;
    &::-webkit-search-cancel-button {
      display: none;
    }
  }

  .keys {
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 8px;
    border-radius: 6px;
    border: 1px solid var(--c-border);
    font-size: 12px;
    flex-shrink: 0;
  }
}
</style>
