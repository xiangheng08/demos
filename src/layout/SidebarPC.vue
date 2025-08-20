<script setup lang="ts">
import { useApp } from '@/hooks/stores'
import MenuItem from './MenuItem.vue'
import SearchButton from './SearchButton.vue'
import GithubIcon from '@/components/icons/GithubIcon.vue'
import { computed, ref, watch } from 'vue'

const { demoConfigs, currentDemoConfig } = useApp()

const keyword = ref('')
const highlightId = ref<string>()
const highlightIndex = ref<number>()

const filteredDemoConfigs = computed(() => {
  if (keyword.value) {
    const regex = new RegExp(keyword.value, 'i')
    return demoConfigs.value.filter((demoConfig) => regex.test(demoConfig.title))
  } else {
    return demoConfigs.value
  }
})

const handleDown = () => {
  if (highlightIndex.value === void 0) {
    highlightId.value = filteredDemoConfigs.value[0].id
    highlightIndex.value = 0
  } else if (highlightIndex.value === filteredDemoConfigs.value.length - 1) {
    highlightId.value = filteredDemoConfigs.value[0].id
    highlightIndex.value = 0
  } else {
    highlightIndex.value++
    highlightId.value = filteredDemoConfigs.value[highlightIndex.value].id
  }
}

const handleUp = () => {
  if (highlightIndex.value === void 0) {
    handleDown()
  } else if (highlightIndex.value === 0) {
    highlightId.value = filteredDemoConfigs.value[filteredDemoConfigs.value.length - 1].id
    highlightIndex.value = filteredDemoConfigs.value.length - 1
  } else {
    highlightIndex.value--
    highlightId.value = filteredDemoConfigs.value[highlightIndex.value].id
  }
}

const handleEnter = () => {
  if (highlightIndex.value !== void 0) {
    const demoConfig = filteredDemoConfigs.value[highlightIndex.value!]
    if (demoConfig) {
      currentDemoConfig.value = demoConfig
    }
  }
}

watch(keyword, (val) => {
  if (!val) {
    highlightId.value = void 0
    highlightIndex.value = void 0
  }
})
</script>

<template>
  <div class="sidebar-header">
    <SearchButton
      v-model:keyword="keyword"
      @down="handleDown"
      @up="handleUp"
      @enter="handleEnter"
    />
  </div>
  <div class="sidebar-body">
    <MenuItem
      v-for="item in filteredDemoConfigs"
      :key="item.id"
      :demo-config="item"
      :active="!!(currentDemoConfig && item.id === currentDemoConfig.id)"
      :highlight="item.id === highlightId"
      @click="currentDemoConfig = item"
    />
  </div>
  <div class="sidebar-footer">
    <a href="https://github.com/xiangheng08/demos.git" target="_blank" class="repository">
      <GithubIcon />
    </a>
  </div>
</template>

<style lang="scss" scoped>
.sidebar-header {
  height: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 12px;
}
.sidebar-body {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: thin;
}
.sidebar-footer {
  height: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  .repository {
    font-size: 24px;
    color: var(--c-solid);
  }
}
</style>
