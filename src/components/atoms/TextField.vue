<template>
  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="input">
      {{ label }}
    </label>
    <input
      v-model="model"
      id="input"
      class="shadow appearance-none border rounded w-full py-4 px-6 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      :type="type"
      :placeholder="placeholder"
    >
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent, SetupContext
} from 'vue'

export default defineComponent({
  name: 'TextField',
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    }
  },
  setup (props, context: SetupContext) {

    const model = computed({
      get () {
        return props.modelValue
      },
      set (value) {
        context.emit('update:modelValue', value)
      }
    })

    return {
      model
    }
  }
})
</script>

<style scoped>

</style>
