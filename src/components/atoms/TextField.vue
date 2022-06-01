<script lang="ts">
import type { SetupContext } from 'vue'
import {
  computed,
  defineComponent,
} from 'vue'

export default defineComponent({
  name: 'TextField',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
  },
  emits: ['update:modelValue'],
  setup(props, context: SetupContext) {
    const model = computed({
      get() {
        return props.modelValue
      },
      set(value) {
        context.emit('update:modelValue', value)
      },
    })

    return {
      model,
    }
  },
})
</script>

<template>
  <div>
    <label
      v-if="label !== ''"
      class="block text-gray-700 text-sm font-bold mb-2" for="input"
    >
      {{ label }}
    </label>
    <input
      id="input"
      v-model="model"
      class="shadow appearance-none border rounded w-full py-4 px-6 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      :type="type"
      :placeholder="placeholder"
    >
  </div>
</template>

<style scoped>

</style>
