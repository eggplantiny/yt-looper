<script lang="ts" setup>
import {
  computed,
  nextTick,
  onMounted,
  reactive,
  ref,
  toRef,
  watch,
} from 'vue'

import {
  nanoid,
} from 'nanoid'
import { useRoute, useRouter } from 'vue-router'
import VSlider from '@vueform/slider'
import useBreakpoints from '@/compositions/useBreakpoints'
import useNotify from '@/compositions/useNotify'

import ACard from '@/components/atoms/ACard.vue'
import AButton from '@/components/atoms/AButton.vue'
import YoutubePlayer from '@/components/atoms/YoutubePlayer.vue'

import type { ISize, Loop } from '@/types'
import type { Color } from '@/types/daisyui.type'
import TextField from '@/components/atoms/TextField.vue'

const route = useRoute()
const router = useRouter()
const breakpoints = useBreakpoints()
const { success, info, danger, warning } = useNotify()

const playerWrapper = ref(null)
const player = ref(null)
const playTime = ref(0)
const playerSize = ref<ISize>({
  width: 320,
  height: 180,
})

const videoId = computed<string>(() => `${route.params.videoId || ''}`)

const tabToLoop = reactive({
  start: 0,
  end: 0,
  tabMode: 0,
})

const tabToLoopBtnColor = computed<Color>(() => {
  if (tabToLoop.tabMode === 0)
    return 'primary'
  else
    return 'secondary'
})

const abLoopBtnLabel = computed<string>(() => {
  if (tabToLoop.tabMode === 0)
    return 'A-B Loop'
  else
    return 'Set B'
})

const currentPath = computed<string>(() => `${location.host}${route.fullPath}`)

const loopList = ref<Loop[]>([])
const playbackRate = reactive({
  items: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(x => ({ label: `${x} X`, value: x })),
  value: 1,
})

watch(loopList, () => {
  loopList.value.sort((a, b) => a.createdAt - b.createdAt ? -1 : 1)
})

const slider = reactive({
  range: [0, 0],
  min: 0,
  max: 0,
  step: 0.1,
  format: value => `${Number(value).toFixed(2)} s`,
})

const sliderValue = toRef(slider, 'range')
const playbackRateRef = toRef(playbackRate, 'value')
const queryRef = toRef(route, 'query')
const ready = ref(false)

const numberInput = reactive({
  start: 0,
  end: 0,
})

function applyTimeRange() {
  const start = Number(numberInput.start)
  const end = Number(numberInput.end)

  if (isNaN(start) || isNaN(end)) {
    danger('❌ Invalid time range')
    return
  }

  if (start > end || Math.abs(start - end) < 0.1) {
    danger('❌ Invalid time range')
    return
  }

  router.push({ path: route.path, query: { s: start, e: end } })
  success('✔Success apply time range')
}

const loop = {
  saveLoop() {
    const loop: Loop = {
      start: slider.range[0],
      end: slider.range[1],
      url: currentPath.value,
      createdAt: Date.now(),
      id: nanoid(),
    }

    loopList.value.push(loop)
    localStorage.setItem(videoId.value, JSON.stringify(loopList.value))
    success('✔️ Saved loop')
  },
  loadLoop() {
    loop.clearLoopList()
    const item = localStorage.getItem(videoId.value)
    if (!item)
      return

    const loops = JSON.parse(item)
    loopList.value.push(...loops)
  },
  deleteLoop(loop: Loop) {
    loopList.value = loopList.value.filter((item: Loop) => item.id !== loop.id)
    localStorage.setItem(videoId.value, JSON.stringify(loopList.value))
    success('✔️ Deleted loop')
  },
  clearLoopList() {
    loopList.value = []
  },
}

const onClick = {
  async applyLoop(loop: Loop) {
    player.value.pauseVideo()

    function removeHost(url: string) {
      const urlObj = new URL(url)
      return `${urlObj.search}`
    }
    await router.push({
      path: removeHost(loop.url),
      query: {
        s: loop.start,
        e: loop.end,
      },
    })
    await nextTick()
    player.value.playVideo()
    success(`✔️ Applied loop ${loop.start}s - ${loop.end}s`)
  },
  async copy(loop?: Loop) {
    let url = ''
    if (!loop)
      url = currentPath.value
    else
      url = loop.url

    await navigator.clipboard.writeText(url)
    success('✔️ URL copied on clipboard')
  },
  tapToLoop() {
    if (tabToLoop.tabMode === 0) {
      tabToLoop.start = playTime.value
      router.push({ path: route.path, query: { s: playTime.value, e: slider.max } })
      tabToLoop.tabMode = 1
      info('✔️ Success set A point')
    }
    else if (tabToLoop.tabMode === 1) {
      tabToLoop.end = playTime.value
      if (tabToLoop.start < tabToLoop.end)
        router.push({ path: route.path, query: { s: tabToLoop.start, e: tabToLoop.end } })

      tabToLoop.start = 0
      tabToLoop.end = 0
      tabToLoop.tabMode = 0
      info('✔️ Success set A-B Loop')
    }
  },
  clearLoop() {
    success('✔️ Success clear loop')
    router.push({ path: route.path })
  },
}

const events = {
  onChangeRange(value) {
    router.push({ path: route.path, query: { s: value[0], e: value[1] } })
  },
  async onTime(value: number) {
    if (ready.value === false)
      return

    playTime.value = value

    if (value > slider.range[1])
      player.value.seekTo(slider.range[0])
    else if (value < slider.range[0])
      player.value.seekTo(slider.range[0])
  },
  async onPlay() {
    const max = await player.value.getDuration()
    slider.max = max
    let start = 0
    let end = max

    if (route.query.s && !isNaN(Number(route.query.s)))
      start = Number(route.query.s)

    if (route.query.e && !isNaN(Number(route.query.e)))
      end = Number(route.query.e)

    slider.range = [start, end]
    ready.value = true
  },
}

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
  immediate: true,
})

onMounted(async () => {
  loop.loadLoop()
  initialize()
})

function initialize() {
  ready.value = false
  loop.loadLoop()
}

function calculatePlayerSize(playerWrapper): ISize {
  let width = 100
  if (playerWrapper.value) {
    const computedStyle = getComputedStyle(playerWrapper.value)
    width = playerWrapper.value?.clientWidth - parseFloat(computedStyle.paddingLeft) - parseFloat(computedStyle.paddingRight)
  }
  const height = width * 0.5625
  return {
    width, height,
  }
}
</script>

<template>
  <section>
    <div
      ref="playerWrapper"
      class="mt-6 rounded-2xl shadow-lg px-4 py-4 bg-base-content"
    >
      <YoutubePlayer
        ref="player"
        :video-id="videoId"
        :autoplay="0"
        :width="playerSize.width"
        :height="playerSize.height"
        @time="events.onTime"
        @play="events.onPlay"
      />
    </div>
    <ACard>
      <p class="text-xl font-bold">
        {{ playTime.toFixed(2) }} SEC
      </p>
      <div class="mt-2">
        <div class="flex flex-col gap-2 items-end">
          <div class="col-span-4 flex items-end gap-2">
            <TextField
              v-model="numberInput.start"
              type="number"
              label="Start"
              class="w-24"
            />

            <TextField
              v-model="numberInput.end"
              type="number"
              label="End"
              class="w-24"
            />

            <AButton
              color="primary"
              @click="applyTimeRange"
            >
              Apply Time Range
            </AButton>
          </div>
          <div class="flex justify-end gap-2">
            <AButton
              :color="tabToLoopBtnColor"
              @click="onClick.tapToLoop"
            >
              {{ abLoopBtnLabel }}
            </AButton>

            <ElInputNumber
              v-model="playbackRate.value"
              :min="0.10"
              :max="2.00"
              :step="0.01"
              label="Playback Rate"
            />
          </div>
        </div>
      </div>
    </ACard>
    <ACard>
      <VSlider
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
          {{ slider.range[0].toFixed(2) }} sec - {{ slider.range[1].toFixed(2) }} sec
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
    </ACard>
    <transition-group
      name="fade"
    >
      <template
        v-for="(item, index) in loopList"
        :key="index"
      >
        <ACard>
          <div>
            {{ item.start.toFixed(2) }} s - {{ item.end.toFixed(2) }} s
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
        </ACard>
      </template>
    </transition-group>
  </section>
</template>

<style scoped lang="scss">
.slider-indigo {
  --slider-connect-bg: #20134E;
  --slider-tooltip-bg: #20134E;
  --slider-handle-ring-color: #20134E;
}

::v-deep(.el-input) {
  height: 48px;
}

::v-deep(.el-input-number__decrease) {
  @apply text-white bg-[#20134E];
}

::v-deep(.el-input-number__increase) {
  @apply text-white bg-[#20134E];
}
</style>
