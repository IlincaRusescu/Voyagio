<template>
  <AppNavbar v-if="showNavbar" />

  <RouterView />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import AppNavbar from './components/layout/AppNavbar.vue'

const route = useRoute()

const showNavbar = computed(() => {
  const pagesWithoutNavbar = [
    '/signin',
    '/signup'
  ]

  return !pagesWithoutNavbar.includes(route.path)
})
</script>