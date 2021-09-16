<template>
  <section>
    <div class="mx-auto">
      <youtube-player
        ref="player"
        :video-id="videoId"
        :autoplay="0"
        @time="onTime"
        @play="onPlay"
      />
    </div>
    <p class="mt-8">
      {{ playTime.toFixed(2) }}
    </p>
    <p class="mt-8">
      <a :href="currentPath">
        {{ currentPath }}
      </a>
    </p>
    <div class="mt-8">
      <slider
        v-model="sliderValue"
        :max="slider.max"
        :min="slider.min"
        :step="slider.step"
        :format="slider.format"
        @change="onChangeRange"
      />
    </div>
  </section>
</template>

<script lang="ts">
import {
  ref,
  defineComponent,
  computed,
  watch,
  reactive,
  toRef, onMounted, nextTick
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
    const router = useRouter()
    const videoId = computed(() => route.params.videoId)
    const player = ref(null)
    const playTime = ref(0)
    const currentPath = computed(() => `${location.host}${route.fullPath}`)

    const slider = reactive({
      range: [0, 0],
      min: 0,
      max: 0,
      step: 0.1,
      format: (value) => `${Number(value).toFixed(2)} 초`
    })

    const sliderValue = toRef(slider, 'range')
    const ready = ref(false)

    const onChangeRange = (value) => {
      router.replace({ path: route.path, query: { s: value[0], e: value[1] } })
    }

    const onTime = async (time: number) => {
      if (ready.value === false) {
        return
      }

      playTime.value = time

      if (time > slider.range[1]) {
        player.value.seekTo(slider.range[0])
      } else if (time < slider.range[0]) {
        player.value.seekTo(slider.range[0])
      }
    }

    const onPlay = () => {
      let start = 0
      let end = slider.max

      if (route.query.s && !isNaN(Number(route.query.s))) {
        start = Number(route.query.s)
      }

      if (route.query.e && !isNaN(Number(route.query.e))) {
        end = Number(route.query.e)
      }

      slider.range = [start, end]
      ready.value = true
    }

    const initialize = async () => {
      console.log('fucking initialized')
      await nextTick()
      slider.max = await player.value.getDuration()
    }

    watch(videoId, async () => {
      ready.value = false
      await player.value.loadVideoById(videoId.value)
      await initialize()
    })

    onMounted(() => {
      initialize()
    })

    return {
      player,
      playTime,
      videoId,
      slider,
      sliderValue,
      currentPath,
      onTime,
      onPlay,
      onChangeRange
    }
  }
})

</script>

<style scoped lang="scss">

</style>
