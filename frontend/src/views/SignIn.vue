<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'

const router = useRouter()

const email = ref('')
const password = ref('')

const errorMessage = ref('')
const successMessage = ref('')
const loading = ref(false)

async function handleSignIn() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter your email and password.'
    return
  }

  loading.value = true

  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  if (error) {
    errorMessage.value = 'Invalid email or password.'
    loading.value = false
    return
  }

  loading.value = false
  router.push('/')
}
</script>

<template>
  <main>
    <h1>Welcome back</h1>

    <form @submit.prevent="handleSignIn">
      <div>
        <label for="email">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          required
        />
      </div>

      <div>
        <label for="password">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          required
        />
      </div>

      <p v-if="errorMessage">
        {{ errorMessage }}
      </p>

      <p v-if="successMessage">
        {{ successMessage }}
      </p>

      <button
        type="submit"
        :disabled="loading"
      >
        {{ loading ? 'Signing in...' : 'Sign in' }}
      </button>
    </form>
  </main>
</template>