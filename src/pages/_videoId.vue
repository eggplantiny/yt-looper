<template>
  <section>
    <div class="mx-auto">
      <YoutubePlayer
        :video-id="videoId"
        :autoplay="0"
        @time="onTime"
        @duration="onChangeDuration"
      />
    </div>
    <p>
      {{ playTime }}
    </p>
    <p>
      <slider
        v-model="playTimes"
        class="slider-blue"
      />
    </p>
  </section>
</template>

<script lang="ts">
import {
  ref,
  defineComponent, computed
} from 'vue'
import { useRoute } from 'vue-router'
import Slider from '@vueform/slider'
import YoutubePlayer from '@/components/atoms/YoutubePlayer.vue'
import TextField from '@/components/atoms/TextField.vue'

export default defineComponent({
  name: 'Home',
  components: {
    Slider,
    TextField,
    YoutubePlayer
  },
  setup () {
    const route = useRoute()
    const videoId = computed(() => route.params.videoId)
    const playTime = ref(0)
    const duration = ref(0)
    const playTimes = ref([0, 100])

    const onTime = (time: number) => {
      playTime.value = time
    }

    const onChangeDuration = (time: number) => {
      console.log(time)
      duration.value = time
      playTimes.value[1] = time
      console.log(playTimes.value)
    }

    return {
      onTime,
      playTime,
      videoId,
      playTimes,
      onChangeDuration
    }
  }
})

</script>

<style scoped lang="scss">

</style>
