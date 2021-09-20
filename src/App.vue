<template>
  <main>
    <notifications />
    <router-view />
  </main>
</template>

<script>
import Notifications from '@kyvg/vue3-notification'

export default {
  components: {
    Notifications
  }
}
</script>

<style lang="scss">

</style>
