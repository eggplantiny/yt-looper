<template>
  <Header />
  <div class="container max-w-3xl sm:px-6 md:px-10 lg:px-16 mt-4 mx-auto">
    <div class="my-4">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, SetupContext } from 'vue'
import { useRouter } from 'vue-router'
import TextField from '@/components/atoms/TextField.vue'
import Header from '@/components/atoms/Header.vue'

export default defineComponent({
  name: 'default',
  components: {
    Header
  },
  setup (_, context: SetupContext) {
  }
})
</script>

<style scoped>

</style>
