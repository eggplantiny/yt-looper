<template>
  <Header />
  <div class="container max-w-3xl px-2 sm:px-6 md:px-10 lg:px-16 mt-8 mx-auto">
    <div class="rounded-2xl shadow-lg px-4 py-4 bg-base-content">
      <div class="flex items-center">
        <div class="form-control w-full">
          <div class="input-group w-full">
            <input
              v-model="searchValue"
              type="text"
              placeholder="Youtube Video URL or ID"
              class="input input-bordered w-full"
              @keydown.enter="search"
            />
            <button
              class="btn btn-square"
              @click="search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          </div>
        </div>
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
import Header from '../components/organisms/Header.vue'
import { useSearch } from '@/compositions/useSearch'

const { search, searchValue } = useSearch()
</script>

<style scoped>

</style>
