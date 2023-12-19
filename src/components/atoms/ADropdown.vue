<script lang="ts" setup>
</script>

<template>
  <ul
    class="dropdown-menu absolute hidden text-grey-700 pt-1 rounded-box w-full"
  >
    <slot />
  </ul>
</template>

<style scoped>
.dropdown:hover .dropdown-menu {
  display: block;
}

.dropdown-menu {
  border-radius: 2em;
}
</style>
