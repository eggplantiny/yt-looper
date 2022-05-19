<template>
  <ul
    class="dropdown-menu absolute hidden text-grey-700 pt-1 rounded-lg w-full"
  >
    <slot />
  </ul>
</template>

<script lang="ts" setup>
</script>

<style scoped>
.dropdown:hover .dropdown-menu {
  display: block;
}

.dropdown-menu {
  border-radius: 2em;
}

</style>
