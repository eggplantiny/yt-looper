<template>
  <section>
    <h2>
      Hello Home
    </h2>
    <youtube-player
      :video-id="videoId"
    />
  </section>
</template>

<script setup lang="ts">
import {
  ref
} from 'vue'
import YoutubePlayer from '@/components/atoms/YoutubePlayer.vue'
export default {
  components: {YoutubePlayer}
}
const videoId = ref('Dmlr6HHGfXo')
</script>

<style scoped lang="scss">

</style>
