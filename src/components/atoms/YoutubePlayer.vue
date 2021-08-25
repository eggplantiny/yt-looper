<template>
  <div
    id="youtube-vue-player"
  />
</template>

<script setup lang="ts">
import Player from 'youtube-player'

import {
  ref,
  defineProps,
  defineEmits,
  watch,
  onMounted,
  onBeforeUnmount,
  PropType,
  Ref
} from 'vue'

import {
  YouTubePlayer
} from 'youtube-player/dist/types'
import { IPlayerVars } from "../../types"

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
  playerVars: {
    type: Object as PropType<IPlayerVars>,
    default: () => ({
      autoplay: 1
    })
  }
})

const emit = defineEmits(['ended', 'paused', 'played', 'buffering', 'time'])
let player: Ref<YouTubePlayer> = ref()

const playTime = ref<number>(0)
const callbackId = ref<number>(0)
const cancelStatus = ref<boolean>(false)

const animationFrameHook = async () => {
  playTime.value = await player.value.getCurrentTime()

  if (cancelStatus.value === true) {
    cancelStatus.value = false
    if (callbackId.value !== 0) {
      callbackId.value = 0
      cancelAnimationFrame(callbackId.value)
    }
    return
  }

  emit('time', playTime.value)
  callbackId.value = requestAnimationFrame(animationFrameHook)
}

const startPlayer = () => {
  cancelStatus.value = false
  animationFrameHook()
}

const pausePlayer = () => {
  cancelStatus.value = true
}

const stopPlayer = () => {
  cancelStatus.value = true
  playTime.value = 0
}

onMounted(() => {
  if (player.value) {
    return
  }

  player.value = Player(props.elementId, {
    width: props.width,
    height: props.height,
    videoId: props.videoId,
    playerVars: props.playerVars
  })

  player.value.on('stateChange', (e) => {
    if (e.data === YT.PlayerState.ENDED) {
      pausePlayer()
      emit('ended', playTime.value)
    } else if (e.data === YT.PlayerState.PAUSED) {
      pausePlayer()
      emit('paused', playTime.value)
    } else if (e.data === YT.PlayerState.PLAYING) {
      startPlayer()
      emit('played', playTime.value)
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

watch(props.videoId, () => {
  stopPlayer()
  player.value.loadVideoById(props.videoId)
  player.value.playVideo()
})
</script>

<style scoped>

</style>
