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
      {{ currentPath }}
    </p>
    <div class="mt-8">
      <slider
        v-model="slider.range"
        :max="slider.max.value"
        :min="slider.min.value"
        :step="slider.step.value"
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
  toRefs, watchEffect
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
    const duration = ref(0)
    const playTimes = ref([0, 0])
    const currentPath = computed(() => `${location.host}${route.fullPath}`)

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

    const onChangeRange = (value) => {
      router.replace({ path: route.path, query: { s: value[0], e: value[1] } })
    }

    const onTime = async (time: number) => {
      playTime.value = time

      if (
        slider.ready.value === false ||
        (slider.range[0] === 0 && slider.range[1] === 0)
      ) {
        return
      }

      if (time > slider.range[1]) {
        player.value.seekTo(slider.range[0])
      } else if (time < slider.range[0]) {
        player.value.seekTo(slider.range[0])
      }
    }

    const onChangeDuration = (time: number) => {
      slider.max.value = time
    }

    watch(slider.max, () => {
      if (slider.ready.value === false) {
        let start = 0
        let end = slider.max.value

        if (route.query.s && !isNaN(Number(route.query.s))) {
          start = Number(route.query.s)
        }

        if (route.query.e && !isNaN(Number(route.query.e))) {
          end = Number(route.query.e)
        }

        slider.range.value = [start, end]
        slider.ready.value = true
      }
    })

    return {
      onChangeRange,
      player,
      playTime,
      videoId,
      playTimes,
      duration,
      slider,
      currentPath,
      onTime,
      onChangeDuration
    }
  }
})

</script>

<style scoped lang="scss">

</style>
