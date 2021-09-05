<template>
  <section>
    <div class="mx-auto">
      <YoutubePlayer
        :video-id="videoId"
        :autoplay="0"
        @time="onTime"
      />
    </div>
    <p>
      {{ playTime }}
    </p>
  </section>
</template>

<script lang="ts">
import {
  ref,
  defineComponent, computed
} from 'vue'
import { useRoute } from 'vue-router'
import YoutubePlayer from '@/components/atoms/YoutubePlayer.vue'
import TextField from '@/components/atoms/TextField.vue'

export default defineComponent({
  name: 'Home',
  components: {
    TextField,
    YoutubePlayer
  },
  setup () {
    const route = useRoute()
    const videoId = computed(() => route.params.videoId)
    const playTime = ref(0)

    const onTime = (time: number) => {
      playTime.value = time
    }

    return {
      onTime,
      playTime,
      videoId
    }
  }
})

</script>

<style scoped lang="scss">

</style>
