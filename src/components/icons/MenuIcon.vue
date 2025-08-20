<script setup lang="ts">
interface Props {
  open?: boolean
}
defineProps<Props>()
</script>

<template>
  <div class="menu-icon" :class="{ open }">
    <div class="menu-icon-bar top"></div>
    <div class="menu-icon-bar middle"></div>
    <div class="menu-icon-bar bottom"></div>
  </div>
</template>

<style lang="scss" scoped>
.menu-icon {
  width: 1em;
  height: 1em;
  display: inline-flex;
  flex-direction: column;
  justify-content: space-between;
  .menu-icon-bar {
    display: block;
    width: 1em;
    height: 0.2em;
    border-radius: 0.1em;
    background-color: currentColor;
    transition: all 0.25s ease;
    pointer-events: none;
  }
  .top {
    transform-origin: 0.1em center;
  }
  .bottom {
    transform-origin: 0.1em center;
  }
  &.open {
    .top {
      transform: rotate(45deg);
    }
    .middle {
      width: 0;
    }
    .bottom {
      transform: rotate(-45deg);
    }
    .top,
    .bottom {
      width: 1.344em;
    }
  }
}
</style>
