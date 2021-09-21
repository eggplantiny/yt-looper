<template>
  <div class="mt-16 flex items-center">
    <text-field
      v-model="searchValue"
      placeholder="Youtube Video URL or ID"
      class="w-full text-center"
      @keydown.enter="search"
    />
    <a-button
      class="ml-4"
      height="60"
      @click="search"
    >
      Search
    </a-button>
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
import AButton from '../components/atoms/AButton.vue'

export default {
  name: 'Home',
  components: {
    AButton,
    TextField
  },
  setup () {
    const searchValue = ref('')
    const router = useRouter()

    const search = () => {
      const parser = new YouTubeURLParser(searchValue.value)

      let videoId = searchValue.value
      if (parser.isValid()) {
        videoId = parser.getId()
      }

      router.push(`/${videoId}`)
    }

    return {
      searchValue,
      search
    }
  }
}
</script>

<style scoped>

</style>
