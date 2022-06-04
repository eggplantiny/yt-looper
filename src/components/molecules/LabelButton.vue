<script lang="ts" setup>
import AButton from '@/components/atoms/AButton.vue'

withDefaults(defineProps<{
  label?: string
}>(), {
  label: null,
})
</script>

<template>
  <div>
    <label v-if="label">
      {{ label }}
    </label>
    <AButton>
      <slot />
    </AButton>
  </div>
</template>

<style scoped lang="scss">

</style>
