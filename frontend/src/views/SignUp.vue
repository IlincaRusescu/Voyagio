<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase'

const router = useRouter()

const firstName = ref('')
const lastName = ref('')
const username = ref('')
const country = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const acceptTerms = ref(false)

const errorMessage = ref('')
const successMessage = ref('')
const loading = ref(false)

async function handleSignUp() {
  errorMessage.value = ''
  successMessage.value = ''

  if (
    !firstName.value ||
    !lastName.value ||
    !username.value ||
    !country.value ||
    !email.value ||
    !password.value ||
    !confirmPassword.value
  ) {
    errorMessage.value = 'Please complete all required fields.'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  if (!acceptTerms.value) {
    errorMessage.value = 'You must accept the Terms & Privacy Policy.'
    return
  }

  loading.value = true

  const { data, error: signUpError } = await supabase.auth.signUp({
    email: email.value,
    password: password.value
  })

  if (signUpError) {
    errorMessage.value = signUpError.message
    loading.value = false
    return
  }

  const user = data.user

  if (!user) {
    errorMessage.value = 'The account could not be created.'
    loading.value = false
    return
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      first_name: firstName.value,
      last_name: lastName.value,
      username: username.value,
      country: country.value
    })

  if (profileError) {
    if (profileError.code === '23505') {
      errorMessage.value = 'This username is already taken.'
    } else {
      errorMessage.value = profileError.message
    }

    loading.value = false
    return
  }

  loading.value = false
  router.push('/')
}
</script>

<template>
  <main>
    <h1>Create your Voyagio account</h1>

    <form @submit.prevent="handleSignUp">
      <div>
        <label for="first-name">First name</label>
        <input
          id="first-name"
          v-model="firstName"
          type="text"
          required
        />
      </div>

      <div>
        <label for="last-name">Last name</label>
        <input
          id="last-name"
          v-model="lastName"
          type="text"
          required
        />
      </div>

      <div>
        <label for="username">Username</label>
        <input
          id="username"
          v-model="username"
          type="text"
          required
        />
      </div>

      <div>
        <label for="country">Country</label>
        <input
          id="country"
          v-model="country"
          type="text"
          required
        />
      </div>

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

      <div>
        <label for="confirm-password">Confirm password</label>
        <input
          id="confirm-password"
          v-model="confirmPassword"
          type="password"
          required
        />
      </div>

      <div>
        <label>
          <input
            v-model="acceptTerms"
            type="checkbox"
          />
          I agree to the Terms & Privacy Policy
        </label>
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
        {{ loading ? 'Creating account...' : 'Sign up' }}
      </button>
    </form>
  </main>
</template>