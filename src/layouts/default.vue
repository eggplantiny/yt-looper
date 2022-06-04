<script lang="ts" setup>
import Header from '@/components/organisms/Header.vue'
import SearchWrapper from '@/components/molecules/SearchWrapper.vue'
</script>

<template>
  <Header />

  <div class="container max-w-3xl px-2 sm:px-6 md:px-10 lg:px-16 mt-8 mx-auto">
    <SearchWrapper />

    <div class="my-4">
      <router-view />
    </div>
  </div>
</template>

<style scoped>

</style>
