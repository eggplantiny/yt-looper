<template>
  <div
    id="youtube-vue-player"
    class="mx-auto"
  />
</template>

<script setup lang="ts">
import {
  ref,
  watch,
  nextTick,
  defineExpose,
  onMounted,
  onBeforeUnmount,
  PropType,
  Ref
} from 'vue'

import Player from 'youtube-player'

import { YouTubePlayer } from 'youtube-player/dist/types'

import { IPlayerVars } from "@/types"
import { delay } from '@/utils/asyncTools'

const props = defineProps({
  autoplay: {
    type: Number as PropType<0 | 1>,
    default: 0,
    validator (value: unknown): boolean {
      return Number(value) === 0 || Number(value) === 1
    }
  },
  loop: {
    type: Number as PropType<0 | 1>,
    default: 0,
    validator (value: unknown): boolean {
      return Number(value) === 0 || Number(value) === 1
    }
  },
  elementId: {
    type: String,
    default: 'youtube-vue-player'
  },
  width: {
    type: Number,
    default: 480
  },
  height: {
    type: Number,
    default: 320
  },
  videoId: {
    type: String,
    required: true
  },
  timing: {
    type: Number,
    default: 66
  },
  playerVars: {
    type: Object as PropType<IPlayerVars>,
    default: () => ({
      autoplay: 1
    })
  }
})

const emit = defineEmits(['ended', 'paused', 'play', 'buffering', 'time'])
let player: Ref<YouTubePlayer> = ref()

const videoId = ref(props.videoId)
const playTime = ref<number>(0)
const callbackId = ref<number>(0)
const cancelStatus = ref<boolean>(false)
const initialized = ref<boolean>(false)
const lastTime = ref<number>(props.timing)

const animationFrameHook = async () => {

  if (cancelStatus.value === true) {
    cancelStatus.value = false
    if (callbackId.value !== 0) {
      callbackId.value = 0
      cancelAnimationFrame(callbackId.value)
    }
    return
  }

  playTime.value = await player.value.getCurrentTime()
  const timingDiff = lastTime.value - playTime.value
  if (timingDiff < props.timing) {
    await delay(timingDiff)
  }

  callbackId.value = requestAnimationFrame(animationFrameHook)
  emit('time', playTime.value)
}

const startPlayer = async () => {
  cancelStatus.value = false

  if (initialized.value === false) {
    initialized.value = true
  }

  return animationFrameHook()
}

const pausePlayer = () => {
  cancelStatus.value = true
}

const stopPlayer = () => {
  cancelStatus.value = true
  playTime.value = 0
}

const seekTo = (time: number) => {
  player.value.seekTo(time, true)
}

const getDuration = () => {
  return player.value.getDuration()
}

const loadVideoById = async (videoId: string) => {
  stopPlayer()
  await nextTick()
  player.value.loadVideoById({ videoId })
}

onMounted(async () => {
  await nextTick()

  if (player.value) {
    return
  }

  player.value = Player(props.elementId, {
    width: props.width,
    height: props.height,
    videoId: props.videoId,
    playerVars: props.playerVars
  })

  player.value.on('stateChange', async (e) => {
    if (e.data === YT.PlayerState.ENDED) {
      pausePlayer()
      emit('ended', playTime.value)
    } else if (e.data === YT.PlayerState.PAUSED) {
      pausePlayer()
      emit('paused', playTime.value)
    } else if (e.data === YT.PlayerState.PLAYING) {
      emit('play', playTime.value)
      startPlayer()
    } else if (e.data === YT.PlayerState.BUFFERING) {
      pausePlayer()
      emit('buffering')
    } else if (e.data === YT.PlayerState.UNSTARTED) {
    }
  })
})

onBeforeUnmount(() => {
  if (player.value) {
    player.value.destroy()
    player.value = null
  }
})

defineExpose({
  seekTo,
  getDuration,
  loadVideoById
})

watch(videoId, async () => {
  stopPlayer()
  await player.value.loadVideoById(videoId.value)
  player.value.playVideo()
})
</script>

<style scoped lang="scss">
</style>
