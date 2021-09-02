<template>
  <section>
    <h2>
      Hello Home
    </h2>
    <p>
      <text-field />
    </p>
    <YoutubePlayer
      :video-id="videoId"
      :autoplay="false"
      @time="onTime"
    />
    <p>
      {{ playTime }}
    </p>
  </section>
</template>

<script lang="ts">
import {
  ref,
  defineComponent
} from 'vue'
import YoutubePlayer from '@/components/atoms/YoutubePlayer.vue'
import TextField from '../components/atoms/TextField.vue'

export default defineComponent({
  name: 'Home',
  components: {
    TextField,
    YoutubePlayer
  },
  setup () {
    const videoId = ref('YOSpS0WOnCo')
    const playTime = ref(0)

    const onTime = (time: number) => {
      playTime.value = time
    }

    return {
      onTime,
      playTime,
      videoId
    }
  }
})

</script>

<style scoped lang="scss">

</style>
