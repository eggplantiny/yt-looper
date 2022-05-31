<template>
  <button
    :class="['btn', computedColor]"
  >
    <slot />
  </button>
</template>

<script lang="ts" setup>
import { computed, defineProps } from 'vue'
import { Color } from '@/types/daisyui.type'

const { color } = defineProps<{
  color?: Color
}>()

const computedColor = computed(() => color ? `btn-${color}` : '')
</script>

<style scoped>

</style>
