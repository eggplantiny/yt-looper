<template>
  <section>
    <div class="mx-auto">
      <youtube-player
        class="py-8 px-8 shadow-lg rounded-2xl"
        ref="player"
        :video-id="videoId"
        :autoplay="0"
        @time="onTime"
        @play="onPlay"
      />
    </div>
    <div class="mt-8 rounded-2xl shadow-lg px-8 py-4">
      <div class="flex justify-between items-center">
        <span>
          {{ playTime.toFixed(2) }} sec
        </span>
        <div>
          <dropdown-menu
            v-model="playbackRate.value"
            :items="playbackRate.items"
          >
            {{ playbackRate.value.toFixed(2) }} x
          </dropdown-menu>
        </div>
      </div>
    </div>
    <div class="mt-8 rounded-2xl shadow-lg px-8 py-4">
      <slider
        v-model="sliderValue"
        class="slider-indigo"
        :max="slider.max"
        :min="slider.min"
        :step="slider.step"
        :format="slider.format"
        @change="onChangeRange"
      />

      <div class="mt-2 flex items-center">
        <span>
            {{ slider.range[0] }} sec - {{ slider.range[1] }} sec
          </span>
        <a-button
          color="indigo"
          class="ml-auto"
          @click="loop.saveLoop"
        >
          Save
        </a-button>
      </div>
    </div>
    <template
      v-for="(item, index) in sortedLoopList"
      :key="index"
    >
      <div class="mt-8 rounded-2xl shadow-lg px-8 py-4">
        <div class="flex justify-between">
          <span>
            {{ item.start }} sec - {{ item.end }} sec
          </span>
          <div class="ml-auto">
            <a-button
              color="red"
              @click="loop.deleteLoop(item)"
            >
              delete
            </a-button>

            <a-button
              color="indigo"
              class="ml-2"
              @click="onClickApplyLoop(item)"
            >
              Apply
            </a-button>
          </div>
        </div>
      </div>
    </template>
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
import {
  nanoid
} from "nanoid"
import { useRoute, useRouter } from 'vue-router'
import Slider from '@vueform/slider'
import AButton from "@/components/atoms/AButton.vue"
import DropdownMenu from "@/components/molecules/DropdownMenu.vue"
import YoutubePlayer from '@/components/atoms/YoutubePlayer.vue'
import TextField from '@/components/atoms/TextField.vue'

import { Loop } from "@/types"


function generatePath (fullPath) {
  return `${location.host}${fullPath}`
}

export default defineComponent({
  name: 'Home',
  components: {
    DropdownMenu,
    AButton,
    Slider,
    TextField,
    YoutubePlayer
  },
  setup () {
    const route = useRoute()
    const router = useRouter()
    const videoId = computed<string>(() => `${route.params.videoId || ''}`)
    const player = ref(null)
    const playTime = ref(0)
    const currentPath = computed(() => `${location.host}${route.fullPath}`)

    const loopList = ref<Loop[]>([])
    const sortedLoopList = computed(() => loopList.value.sort((a, b) => a.createdAt - b.createdAt ? -1 : 1))
    const playbackRate = reactive({
      items: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
      value: 1
    })

    const slider = reactive({
      range: [0, 0],
      min: 0,
      max: 0,
      step: 0.1,
      format: (value) => `${Number(value).toFixed(2)} 초`
    })

    const sliderRef = toRef(slider, 'range')
    const playbackRateRef = toRef(playbackRate, 'value')
    const queryRef = toRef(route, 'query')
    const ready = ref(false)

    const onChangeRange = (value) => {
      router.push({ path: route.path, query: { s: value[0], e: value[1] } })
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
      await nextTick()
      slider.max = await player.value.getDuration()
    }

    const loop = reactive({
      saveLoop () {
        const loop: Loop = {
          start: slider.range[0],
          end: slider.range[1],
          url: currentPath.value,
          createdAt: Date.now(),
          id: nanoid()
        }

        loopList.value.push(loop)
        localStorage.setItem(videoId.value, JSON.stringify(loopList.value))
      },
      loadLoop () {
        const item = localStorage.getItem(videoId.value)
        if (!item) {
          return
        }

        const loops = JSON.parse(item)
        loopList.value.push(...loops)
      },
      deleteLoop (loop: Loop) {
        loopList.value = loopList.value.filter((item: Loop) => item.id !== loop.id)
        localStorage.setItem(videoId.value, JSON.stringify(loopList.value))
      }
    })

    const onClickApplyLoop = (loop: Loop) => {
      player.value.pauseVideo()
      router.push(loop.url)
      player.value.playVideo()
    }

    watch(videoId, async () => {
      ready.value = false
      await player.value.loadVideoById(videoId.value)
      await initialize()
    })

    watch(queryRef, async () => {
      player.value.pauseVideo()
      player.value.playVideo()
    })

    watch(playbackRateRef, (value) => {
      player.value.setPlaybackRate(value)
    })

    onMounted(() => {
      loop.loadLoop()
      initialize()
    })

    return {
      player,
      playTime,
      videoId,
      slider,
      sliderValue: sliderRef,
      sortedLoopList,
      currentPath,
      playbackRate,
      loopList,
      loop,
      onTime,
      onPlay,
      onChangeRange,
      onClickApplyLoop
    }
  }
})

</script>

<style scoped lang="scss">
.slider-indigo {
  --slider-connect-bg: #6366F1;
  --slider-tooltip-bg: #6366F1;
  --slider-handle-ring-color: #3730A3;
}

</style>
