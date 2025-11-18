<script setup>
import { onMounted } from 'vue'
import { api } from '../api'

onMounted(async () => {
  try {
    const res = await api.get('/')
    console.log(res.data)
  } catch (err) {
    console.error('API error:', err)
  }
})
</script>

<template>
  <div class="home">
    <h1>Voyagio</h1>
    <p>Testing backend connection...</p>
  </div>
</template>

<style scoped>
.home {
  padding: 2rem;
  color: white;
}
</style>
