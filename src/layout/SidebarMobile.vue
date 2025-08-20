<script setup lang="ts">
import { ref } from 'vue'
import { useApp } from '@/hooks/stores'
import MenuIcon from '@/components/icons/MenuIcon.vue'
import MenuItem from './MenuItem.vue'
import type { DemoConfig } from 'virtual:demos'

const { demoConfigs, currentDemoConfig } = useApp()
const menuOpen = ref(false)

const handleClick = (demoConfig: DemoConfig) => {
  menuOpen.value = false
  currentDemoConfig.value = demoConfig
}
</script>

<template>
  <div class="demo-name truncate">{{ currentDemoConfig?.title }}</div>
  <MenuIcon @click="menuOpen = !menuOpen" :open="menuOpen" class="menu-icon" />
  <div class="menu" v-if="menuOpen">
    <MenuItem
      v-for="item in demoConfigs"
      :key="item.id"
      :demo-config="item"
      :active="!!(currentDemoConfig && item.id === currentDemoConfig.id)"
      @click="handleClick(item)"
    />
  </div>
</template>

<style lang="scss" scoped>
.demo-name {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-color);
}
.menu-icon {
  cursor: pointer;
}
.menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: calc(100vh - 60px);
  background-color: var(--c-bg);
  overflow-y: auto;
  scrollbar-width: thin;
}
.repository {
  font-size: 24px;
  color: var(--c-solid);
}
</style>
