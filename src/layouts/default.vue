<template>
  <div class="container max-w-2xl mx-auto">
    <p>
      <text-field
        v-model="searchText"
        placeholder="Youtube Video ID"
        @keydown.enter="onEnter"
      />
    </p>
    {{ searchText }}
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, SetupContext } from 'vue'
import { useRouter } from 'vue-router'
import TextField from '@/components/atoms/TextField.vue'

export default defineComponent({
  name: 'default',
  components: {
    TextField
  },
  setup (_, context: SetupContext) {
    const router = useRouter()
    const searchText = ref('')
    const onEnter = () => {
      const videoId = searchText.value
      router.push(`/${videoId}`)
    }

    return {
      searchText,
      onEnter
    }
  }
})
</script>

<style scoped>

</style>
