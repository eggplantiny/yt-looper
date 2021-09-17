<template>
  <div class="dropdown inline-block relative">
    <button class="bg-gray-300 text-gray-700 font-semibold px-4 py-2 rounded inline-flex items-center">
      <span>
        <slot />
      </span>
      <svg
        class="fill-current h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
        />
      </svg>
      <a-dropdown>
        <a-list-item>
          Hello World
        </a-list-item>
      </a-dropdown>
    </button>
  </div>
</template>

<script lang="ts">
import ADropdown from "@/components/atoms/ADropdown.vue"
import AListItem from "@/components/atoms/AListItem.vue"

export default {
  name: 'DropdownMenu',
  components: {
    AListItem, ADropdown
  }
}
</script>

<style scoped>
.dropdown:hover {
  display: block;
}
</style>
