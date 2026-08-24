<script setup>
import { onMounted, ref } from 'vue'
import { supabase } from '../lib/supabase'

const userEmail = ref('')
const firstName = ref('')
const loading = ref(true)
const errorMessage = ref('')
const logoutMessage = ref('')
const backendMessage = ref('')

async function loadUser() {
  errorMessage.value = ''

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user) {
    errorMessage.value = 'No logged in user found.'
    loading.value = false
    return
  }

  userEmail.value = user.email

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('first_name')
    .eq('id', user.id)
    .single()

  if (profileError) {
    errorMessage.value = 'Could not load your profile.'
    loading.value = false
    return
  }

  firstName.value = profile.first_name
  loading.value = false
}

async function handleLogout() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    errorMessage.value = 'Could not log out.'
    return
  }

  logoutMessage.value = 'You have been logged out successfully.'

  setTimeout(() => {
    window.location.replace('/signin')
  }, 2000)
}

async function testBackendAuth() {
  backendMessage.value = ''

  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session) {
    backendMessage.value = 'No active session found.'
    return
  }

  try {
    const response = await fetch('http://localhost:3000/api/me', {
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    })

    const data = await response.json()

    if (!response.ok) {
      backendMessage.value = data.error || 'Backend authentication failed.'
      return
    }

    backendMessage.value = `Backend verified: ${data.email}`
  } catch (error) {
    backendMessage.value = 'Could not connect to the backend.'
  }
}

onMounted(() => {
  loadUser()
})
</script>

<template>
  <main>
    <p v-if="loading">
      Loading...
    </p>

    <div v-else-if="userEmail">
      <h1>Welcome, {{ firstName }}!</h1>

      <p>
        Logged in as: {{ userEmail }}
      </p>

      <button @click="handleLogout">
        Log out
      </button>

      <button @click="testBackendAuth">
        Test backend auth
      </button>

      <p v-if="backendMessage">
        {{ backendMessage }}
      </p>

      <p v-if="logoutMessage">
        {{ logoutMessage }}
      </p>
    </div>

    <div v-else>
      <h1>Voyagio</h1>

      <p>
        You are not logged in.
      </p>
    </div>

    <p v-if="errorMessage">
      {{ errorMessage }}
    </p>
  </main>
</template>