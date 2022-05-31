<template>
  <div class="dropdown dropdown-hover dropdown-left">
    <label tabindex="0" class="btn">
      <slot />
    </label>
    <ul tabindex="0" class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
      <template v-for="(item, index) in items" :key="index">
        <li class="text-white">
          <a @click="onClickItem(item)">{{ item.label }}</a>
        </li>
      </template>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
interface Item {
  value: string | number
  label: string
}
const emits = defineEmits(['update:modelValue'])
const { items } = withDefaults(defineProps<{
  items: Item[]
  modelValue: unknown
}>(), {
  items: () => []
})

function onClickItem (item: Item) {
  emits('update:modelValue', item.value)
}
</script>

<style scoped>
</style>
