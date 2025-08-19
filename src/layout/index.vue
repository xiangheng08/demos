<script setup lang="ts">
import Main from './Main.vue'
import Sidebar from './Sidebar.vue'
import Viewport from './Viewport.vue'
import { useApp } from '@/hooks/stores'

const { isMobile, currentDemoConfig } = useApp()
</script>

<template>
  <section class="layout" :class="{ mobile: isMobile }">
    <Sidebar />
    <Main>
      <Viewport
        v-if="currentDemoConfig"
        :key="currentDemoConfig.id"
        :demo-config="currentDemoConfig"
      />
    </Main>
  </section>
</template>

<style lang="scss" scoped>
.layout {
  display: flex;
  width: 100%;
  height: 100%;

  &.mobile {
    flex-direction: column-reverse;
  }
}
</style>
