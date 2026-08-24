<script setup>
import { ref, onMounted } from 'vue'

const message = ref('Loading...')

onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/api/test')
    const data = await response.json()

    message.value = data.message
  } catch (error) {
    message.value = 'Could not connect to backend'
  }
})
</script>

<template>
  <main>
    <h1>Voyagio 2.0</h1>
    <p>{{ message }}</p>
  </main>
</template> 