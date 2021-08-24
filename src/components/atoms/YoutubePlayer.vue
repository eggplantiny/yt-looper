<template>
  <div
    ref="player"
    id="youtube-vue-player"
  />
</template>

<script setup lang="ts">
import Player from 'youtube-player'

import {
  defineProps,
  defineEmits,
  watch,
  onMounted,
  onUnmounted,
  PropType
} from 'vue'

import {
  YouTubePlayer
} from 'youtube-player/dist/types'

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
  }
})
const emit = defineEmits(['ended', 'paused', 'played'])
let player: YouTubePlayer = null

onMounted(() => {
  const playerVars = {
    autoplay: props.autoplay,
    loop: props.loop
  }

  player = Player(props.elementId, {
    width: props.width,
    height: props.height,
    videoId: props.videoId,
    playerVars: playerVars
  })

  player.on('stateChange', (e) => {
    if (e.data === YT.PlayerState.ENDED) {
      emit('ended')
    } else if (e.data === YT.PlayerState.PAUSED) {
      emit('paused')
    } else if (e.data === YT.PlayerState.PLAYING) {
      emit('played')
    }
  })
})

onUnmounted(() => {
  player.destroy()
  player = null
})

watch(props.videoId, () => {
  player.loadVideoById(props.videoId)
  player.playVideo()
})
</script>

<style scoped>

</style>
