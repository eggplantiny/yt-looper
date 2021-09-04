<template>
  <div class="mb-4">
    <label class="block text-gray-700 text-sm font-bold mb-2" for="input">
      {{ label }}
    </label>
    <input
      v-model="model"
      id="input"
      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      :type="type"
      :placeholder="placeholder"
    >
  </div>
</template>

<script lang="ts">
import {
  defineComponent
} from 'vue'
import useModel from '@/compositions/useModel'

export default defineComponent({
  name: 'TextField',

  props: {
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
  setup (props, context) {
    const model = useModel<string>(context)

    return {
      model
    }
  }
})
</script>

<style scoped>

</style>
