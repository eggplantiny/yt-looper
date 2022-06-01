<script lang="ts" setup>
import { computed, defineProps } from 'vue'
import type { Color } from '@/types/daisyui.type'

const { color } = defineProps<{
  color?: Color
}>()

const computedColor = computed(() => color ? `btn-${color}` : '')
</script>

<template>
  <button
    class="btn" :class="[computedColor]"
  >
    <slot />
  </button>
</template>

<style scoped>

</style>
