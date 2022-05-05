<template>
  <Header />
  <div class="container max-w-3xl px-2 sm:px-6 md:px-10 lg:px-16 mt-8 mx-auto">
    <div class="rounded-2xl shadow-lg px-4 py-4 bg-purple-100">
      <div class="flex items-center">
        <text-field
          v-model="searchValue"
          placeholder="Youtube Video URL or ID"
          class="w-full text-center"
          @keydown.enter="search"
        />
        <a-button
          class="ml-4"
          height="60"
          @click="search"
        >
          Search
        </a-button>
      </div>
    </div>

    <div class="my-4">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts" setup>
import TextField from '@/components/atoms/TextField.vue'
import AButton from '@/components/atoms/AButton.vue'
import Header from '@/components/atoms/Header.vue'
import { useSearch } from '@/compositions/useSearch'

const { search, searchValue } = useSearch()
</script>

<style scoped>

</style>
