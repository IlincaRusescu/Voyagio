<script setup>
import { onMounted, ref } from 'vue'
import { supabase } from '../lib/supabase'
import { useRouter } from 'vue-router'

const userEmail = ref('')
const firstName = ref('')
const loading = ref(true)
const errorMessage = ref('')
const logoutMessage = ref('')
const router = useRouter()

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

function goToCreateTrip() {
  router.push('/create-trip')
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

      <button @click="goToCreateTrip">
        Create Trip
      </button>

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