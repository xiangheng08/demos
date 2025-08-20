<script setup lang="ts">
import { useApp } from '@/hooks/stores'
import { defineAsyncComponent } from 'vue'

const SidebarPC = defineAsyncComponent(() => import('./SidebarPC.vue'))
const SidebarMobile = defineAsyncComponent(() => import('./SidebarMobile.vue'))

const { isMobile } = useApp()
</script>

<template>
  <section class="sidebar">
    <SidebarMobile v-if="isMobile" />
    <SidebarPC v-else />
  </section>
</template>

<style lang="scss" scoped>
.sidebar {
  width: 260px;
  display: flex;
  flex-direction: column;
}
.mobile .sidebar {
  width: 100%;
  height: 60px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
}
</style>
