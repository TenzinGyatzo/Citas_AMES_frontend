<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<!-- App.vue -->
<template>
  <div class="app-background h-screen overflow-y-scroll">
    <div class="md:flex h-full">
      <div class="h-64 md:h-auto bg-cover bg-center md:w-1/3 bg-app"></div>
      <div class="md:w-2/3 px-10 py-5 h-full">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-background {
  background-image: linear-gradient(120deg, #0e3344 20%, #5e5c55 100%);
}
</style>
