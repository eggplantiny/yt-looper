<template>
  <div class="mt-16">
    <text-field
      v-model="searchValue"
      placeholder="Youtube Video URL or ID"
      @keydown.enter="onEntered"
    />
  </div>
</template>

<script lang="ts">
import { YouTubeURLParser } from '@iktakahiro/youtube-url-parser'
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
      const parser = new YouTubeURLParser(searchValue.value)

      let videoId = searchValue.value
      if (parser.isValid()) {
        videoId = parser.getId()
      }

      router.push(`/${videoId}`)
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
