<template>
  <div class="mt-8 flex items-center">

  </div>
</template>

<script lang="ts">
import {
  YouTubeURLParser
} from '@iktakahiro/youtube-url-parser'
import TextField from '@/components/atoms/TextField.vue'
import {
  ref
} from 'vue'

import {
  useRoute,
  useRouter
} from "vue-router"
import AButton from '@/components/atoms/AButton.vue'

export default {
  name: 'Home',
  components: {
    AButton,
    TextField
  }
}
</script>

<style scoped>

</style>
