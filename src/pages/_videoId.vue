<template>
  <section>
    <div class="mx-auto">
      <youtube-player
        class="py-6 px-6 shadow-lg rounded-2xl bg-purple-100"
        ref="player"
        :video-id="videoId"
        :autoplay="0"
        :width="playerSize.width"
        :height="playerSize.height"
        @time="onTime"
        @play="onPlay"
      />
    </div>
    <div class="mt-8 rounded-2xl shadow-lg px-8 py-4 bg-purple-100">
      <span>
        {{ playTime.toFixed(2) }} s
      </span>
      <div class="mt-2">
        <div class="flex justify-end">
          <a-button
            height="44.5"
            :color="tabToLoopBtnColor"
            @click="onClick.tapToLoop"
          >
            A-B Loop
          </a-button>
          <dropdown-menu
            v-model="playbackRate.value"
            :items="playbackRate.items"
            class="ml-2"
          >
            {{ playbackRate.value.toFixed(2) }} x
          </dropdown-menu>
        </div>
      </div>
    </div>
    <div class="mt-8 rounded-2xl shadow-lg px-8 py-4 bg-purple-100">
      <slider
        v-model="sliderValue"
        class="slider-indigo"
        :max="slider.max"
        :min="slider.min"
        :step="slider.step"
        :format="slider.format"
        @change="onChangeRange"
      />

      <div class="mt-2">
        <span>
          {{ slider.range[0] }} sec - {{ slider.range[1] }} sec
        </span>
      </div>
      <div class="mt-2 flex justify-end">
        <a-button
          color="green"
          @click="onClick.copy()"
        >
          Copy
        </a-button>
        <a-button
          color="blue"
          class="ml-2"
          @click="onClick.clearLoop"
        >
          Clear
        </a-button>
        <a-button
          color="indigo"
          class="ml-2"
          @click="loop.saveLoop"
        >
          Save
        </a-button>
      </div>
    </div>
    <transition-group
      name="fade"
    >
      <template
        v-for="(item, index) in sortedLoopList"
        :key="index"
      >
        <div class="mt-8 rounded-2xl shadow-lg px-8 py-4 bg-purple-100">
          <div>
            {{ item.start }} s - {{ item.end }} s
          </div>
          <div class="flex justify-end mt-3">
            <a-button
              color="green"
              @click="onClick.copy(item)"
            >
              Copy
            </a-button>
            <a-button
              color="red"
              class="ml-2"
              @click="loop.deleteLoop(item)"
            >
              Delete
            </a-button>
            <a-button
              color="indigo"
              class="ml-2"
              @click="onClick.applyLoop(item)"
            >
              Apply
            </a-button>
          </div>
        </div>
      </template>
    </transition-group>
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
import useBreakpoints from '@/compositions/useBreakpoints'
import useNotify from '@/compositions/useNotify'
import Slider from '@vueform/slider'
import AButton from "@/components/atoms/AButton.vue"
import DropdownMenu from "@/components/molecules/DropdownMenu.vue"
import YoutubePlayer from '@/components/atoms/YoutubePlayer.vue'
import TextField from '@/components/atoms/TextField.vue'

import { ISize, Loop } from '@/types'
import { info } from 'autoprefixer'

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
    const breakpoints = useBreakpoints()
    const { success, info, danger, warning } = useNotify()
    const videoId = computed<string>(() => `${route.params.videoId || ''}`)
    const player = ref(null)
    const playTime = ref(0)
    const tabToLoopBtnColor = computed(() => {
      if (tabToLoop.tabMode === 0) {
        return 'indigo'
      } else {
        return 'green'
      }
    })
    const currentPath = computed(() => `${location.host}${route.fullPath}`)
    const playerSize = computed<ISize>(() => {
      if (breakpoints.type.value === 'xs') {
        return {
          width: 320,
          height: 240
        }
      } else if (breakpoints.type.value === 'md') {
        return {
          width: 480,
          height: 320
        }
      } else {
        return {
          width: 640,
          height: 480
        }
      }
    })

    const tabToLoop = reactive({
      start: 0,
      end: 0,
      tabMode: 0
    })

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
      format: (value) => `${Number(value).toFixed(2)} s`
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

    const onPlay = async () => {
      const max = await player.value.getDuration()
      slider.max = max
      let start = 0
      let end = max

      if (route.query.s && !isNaN(Number(route.query.s))) {
        start = Number(route.query.s)
      }

      if (route.query.e && !isNaN(Number(route.query.e))) {
        end = Number(route.query.e)
      }

      slider.range = [start, end]
      ready.value = true
    }

    const initialize = () => {
      ready.value = false
      loop.loadLoop()
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
        success(`✔️ Saved loop`)
      },
      loadLoop () {
        loop.clearLoopList()
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
        success(`✔️ Deleted loop`)
      },
      clearLoopList () {
        loopList.value = []
      }
    })

    const onClick = reactive({
      async applyLoop (loop: Loop) {
        player.value.pauseVideo()
        await router.push(loop.url)
        await nextTick()
        player.value.playVideo()
        success(`✔️ Applied loop ${loop.start}s - ${loop.end}s`)
      },
      async copy (loop?: Loop) {
        let url = ''
        if (!loop) {
          url = currentPath.value
        } else {
          url = loop.url
        }
        await navigator.clipboard.writeText(url)
        success('✔️ URL copied on clipboard')
      },
      tapToLoop () {
        if (tabToLoop.tabMode === 0) {
          tabToLoop.start = playTime.value
          router.push({ path: route.path, query: { s: playTime.value, e: slider.max } })
          tabToLoop.tabMode = 1
          info('✔️ Success set A point')
        }
        else if (tabToLoop.tabMode === 1) {
          tabToLoop.end = playTime.value
          if (tabToLoop.start < tabToLoop.end) {
            router.push({ path: route.path, query: { s: tabToLoop.start, e: tabToLoop.end } })
          }
          tabToLoop.start = 0
          tabToLoop.end = 0
          tabToLoop.tabMode = 0
          info('✔️ Success set A-B Loop')
        }
      },
      clearLoop () {
        success('✔️ Success clear loop')
        router.push({ path: route.path })
      }
    })

    watch(videoId, async () => {
      location.reload()
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
      playerSize,
      tabToLoop,
      tabToLoopBtnColor,
      onTime,
      onPlay,
      onChangeRange,
      onClick
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
