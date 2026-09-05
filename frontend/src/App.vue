<template>
  <AppNavbar v-if="showNavbar" />

  <RouterView />

  <AppFooter v-if="showFooter" />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import AppNavbar from './components/layout/AppNavbar.vue'
import AppFooter from './components/layout/AppFooter.vue'

const route = useRoute()

const pagesWithoutAppLayout = [
  '/signin',
  '/signup'
]

const showNavbar = computed(() => {
  return !pagesWithoutAppLayout.includes(route.path)
})

const showFooter = computed(() => {
  return !pagesWithoutAppLayout.includes(route.path)
})
</script>