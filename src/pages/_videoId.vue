<template>
  <section>
    <div
      ref="playerWrapper"
      class="mt-6 rounded-2xl shadow-lg px-4 py-4 bg-base-content"
    >
      <youtube-player
        ref="player"
        :video-id="videoId"
        :autoplay="0"
        :width="playerSize.width"
        :height="playerSize.height"
        @time="events.onTime"
        @play="events.onPlay"
      />
    </div>
    <a-card>
      <span>
        {{ playTime.toFixed(2) }} s
      </span>
      <div class="mt-2">
        <div class="flex justify-end">
          <AButton
            height="44.5"
            :color="tabToLoopBtnColor"
            @click="onClick.tapToLoop"
          >
            A-B Loop
          </AButton>
          <dropdown-menu
            v-model="playbackRate.value"
            height="44.5"
            :items="playbackRate.items"
            class="ml-2"
          >
            {{ playbackRate.value.toFixed(2) }} x
          </dropdown-menu>
        </div>
      </div>
    </a-card>
    <a-card>
      <slider
        v-model="sliderValue"
        class="slider-indigo"
        :max="slider.max"
        :min="slider.min"
        :step="slider.step"
        :format="slider.format"
        @change="events.onChangeRange"
      />

      <div class="mt-2">
        <span>
          {{ slider.range[0] }} sec - {{ slider.range[1] }} sec
        </span>
      </div>
      <div class="mt-2 flex justify-end">
        <AButton
          color="warning"
          @click="onClick.copy()"
        >
          Copy
        </AButton>
        <AButton
          color="error"
          class="ml-2"
          @click="onClick.clearLoop"
        >
          Clear
        </AButton>
        <AButton
          color="success"
          class="ml-2"
          @click="loop.saveLoop"
        >
          Save
        </AButton>
      </div>
    </a-card>
    <transition-group
      name="fade"
    >
      <template
        v-for="(item, index) in sortedLoopList"
        :key="index"
      >
        <a-card>
          <div>
            {{ item.start }} s - {{ item.end }} s
          </div>
          <div class="flex justify-end mt-3">
            <AButton
              color="warning"
              @click="onClick.copy(item)"
            >
              Copy
            </AButton>
            <AButton
              color="error"
              class="ml-2"
              @click="loop.deleteLoop(item)"
            >
              Delete
            </AButton>
            <AButton
              color="primary"
              class="ml-2"
              @click="onClick.applyLoop(item)"
            >
              Apply
            </AButton>
          </div>
        </a-card>
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
import ACard from '@/components/atoms/ACard.vue'
import AButton from "@/components/atoms/AButton.vue"
import DropdownMenu from "@/components/molecules/DropdownMenu.vue"
import YoutubePlayer from '@/components/atoms/YoutubePlayer.vue'
import TextField from '@/components/atoms/TextField.vue'

import { ISize, Loop } from '@/types'
import { Color } from '@/types/daisyui.type'

function calculatePlayerSize (playerWrapper): ISize {
  let width = 100
  if (playerWrapper.value) {
    const computedStyle = getComputedStyle(playerWrapper.value)
    width = playerWrapper.value?.clientWidth - parseFloat(computedStyle.paddingLeft) - parseFloat(computedStyle.paddingRight)
  }
  const height = width * 0.5625
  return {
    width, height
  }
}

export default defineComponent({
  name: 'Home',
  components: {
    AButton,
    ACard,
    DropdownMenu,
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
    const playerWrapper = ref(null)
    const player = ref(null)
    const playTime = ref(0)
    const tabToLoopBtnColor = computed<Color>(() => {
      if (tabToLoop.tabMode === 0) {
        return 'primary'
      } else {
        return 'secondary'
      }
    })
    const currentPath = computed(() => `${location.host}${route.fullPath}`)
    const playerSize = ref<ISize>({
      width: 320,
      height: 180
    })

    const tabToLoop = reactive({
      start: 0,
      end: 0,
      tabMode: 0
    })

    const loopList = ref<Loop[]>([])
    const sortedLoopList = computed(() => loopList.value.sort((a, b) => a.createdAt - b.createdAt ? -1 : 1))
    const playbackRate = reactive({
      items: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(x => ({ label: `${x} X`, value: x })),
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

    const events = reactive({
      onChangeRange (value) {
        router.push({ path: route.path, query: { s: value[0], e: value[1] } })
      },
      async onTime (value: number) {
        if (ready.value === false) {
          return
        }

        playTime.value = value

        if (value > slider.range[1]) {
          player.value.seekTo(slider.range[0])
        } else if (value < slider.range[0]) {
          player.value.seekTo(slider.range[0])
        }
      },
      async onPlay () {
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

    watch(breakpoints.width, async () => {
      await nextTick()
      const { width, height } = calculatePlayerSize(playerWrapper)
      playerSize.value = { width, height }
    }, {
      immediate: true
    })


    onMounted(async () => {
      loop.loadLoop()
      initialize()
    })

    return {
      player,
      playerWrapper,
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
      events,
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
