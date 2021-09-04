<template>
  <div class="container max-w-2xl mx-auto">
    <p>
      <text-field
        v-model="searchText"
        placeholder="Youtube Video ID"
      />
    </p>
    {{ searchText }}
    <router-view />
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import TextField from '@/components/atoms/TextField.vue'

export default defineComponent({
  name: 'default',
  components: {
    TextField
  },
  setup () {
    const searchText = ref('')

    return {
      searchText
    }
  }
})
</script>

<style scoped>

</style>
