<template>
  <section>
    <h2>
      Hello Home
    </h2>
    <YoutubePlayer
      :video-id="videoId"
      :autoplay="false"
      @time="onTime"
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
    const videoId = ref('Ht99auBFCY4')

    const onTime = (playTime: number) => {
      console.log(playTime)
    }

    return {
      onTime,
      videoId
    }
  }
})

</script>

<style scoped lang="scss">

</style>
