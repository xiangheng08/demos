<script setup lang="ts">
import type { DemoConfig } from 'virtual:demos'

interface Props {
  demoConfig: DemoConfig
  active?: boolean
  highlight?: boolean
}
defineProps<Props>()
</script>

<template>
  <div class="menu-item" :class="{ active, highlight }">
    <span class="title truncate">{{ demoConfig.title }}</span>
  </div>
</template>

<style lang="scss" scoped>
.menu-item {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  margin: 12px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease-in-out;

  &:hover,
  &.highlight {
    background-color: var(--c-default-soft);
  }

  &.active {
    color: var(--c-brand-1);
    background-color: var(--c-default-soft);
  }
}
</style>
