<template>
  <div>
    <text-field
      v-model="searchValue"
      @keydown.enter="onEntered"
    />
  </div>
</template>

<script lang="ts">
import TextField from '@/components/atoms/TextField.vue'
import {
  ref
} from 'vue'

import {
  useRoute,
  useRouter
} from "vue-router"

export default {
  name: 'Home',
  components: {
    TextField
  },
  setup () {
    const searchValue = ref('')
    const route = useRoute()
    const router = useRouter()

    const onEntered = () => {
      const searchTarget = searchValue.value
      router.push(`/${searchTarget}`)
    }

    return {
      searchValue,
      onEntered
    }
  }
}
</script>

<style scoped>

</style>
