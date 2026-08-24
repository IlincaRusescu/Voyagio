<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from './lib/supabase'

const status = ref('Testing Supabase connection...')

onMounted(async () => {
  try {
    const { error } = await supabase.auth.getSession()

    if (error) {
      status.value = 'Supabase connection failed'
      console.error(error)
      return
    }

    status.value = 'Supabase connection is working'
  } catch (error) {
    status.value = 'Supabase connection failed'
    console.error(error)
  }
})
</script>

<template>
  <main>
    <h1>Voyagio 2.0</h1>
    <p>{{ status }}</p>
  </main>
</template>