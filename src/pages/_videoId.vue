<template>
  <section>
    <div class="mx-auto">
      <youtube-player
        ref="player"
        :video-id="videoId"
        :autoplay="0"
        @time="onTime"
        @duration="onChangeDuration"
      />
    </div>
    <p class="mt-8">
      {{ playTime }}
    </p>
    <p class="mt-8">
      <slider
        v-model="slider.range"
        :max="slider.max.value"
        :min="slider.min.value"
        :step="slider.step.value"
        :format="slider.format"
        class="slider-blue"
      />
    </p>
  </section>
</template>

<script lang="ts">
import {
  ref,
  defineComponent,
  computed,
  watch, reactive, toRefs, onMounted
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
    const player = ref(null)
    const playTime = ref(0)
    const duration = ref(0)
    const playTimes = ref([0, 0])

    const slider = toRefs(
      reactive({
        ready: false,
        range: [0, 0],
        min: 0,
        max: 0,
        step: 0.1,
        format: (value) => `${Number(value).toFixed(2)} 초`
      })
    )

    const onTime = (time: number) => {
      playTime.value = time

      if (slider.ready.value === false) {
        return
      }

      if (time > slider.range[1]) {
        console.log(player.value)
        player.value.seekTo(slider.range[0])
      }
    }

    const onChangeDuration = (time: number) => {
      slider.max.value = time
    }

    onMounted(() => {
      console.log('fucking', player.value)
    })

    watch(slider.max, () => {
      if (slider.ready.value === false) {
        slider.range.value = [0, slider.max.value]
      }

      slider.ready.value = true
    })

    return {
      player,
      playTime,
      videoId,
      playTimes,
      duration,
      slider,
      onTime,
      onChangeDuration
    }
  }
})

</script>

<style scoped lang="scss">

</style>
