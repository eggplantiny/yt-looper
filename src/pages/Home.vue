<template>
  <section>
    <h2>
      Hello Home
    </h2>
    <YoutubePlayer
      :video-id="videoId"
      :autoplay="true"
    />
  </section>
</template>

<script lang="ts">
import {
  ref,
  defineComponent
} from 'vue'
import YoutubePlayer from '@/components/atoms/YoutubePlayer.vue'

export default defineComponent({
  name: 'Home',
  components: {
    YoutubePlayer
  },
  setup () {
    const videoId = ref('Dmlr6HHGfXo')

    return {
      videoId
    }
  }
})

</script>

<style scoped lang="scss">

</style>
