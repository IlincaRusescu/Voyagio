<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { supabase } from '../lib/supabase'
import { useUserStore } from '../stores/userStore'

import logoAppLight from '../assets/logo_app_light.svg'

const router = useRouter()
const userStore = useUserStore()

const email = ref('')
const password = ref('')

const errorMessage = ref('')
const loading = ref(false)

async function handleSignIn() {
  errorMessage.value = ''

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

  await userStore.loadUser()

  loading.value = false
  router.push('/')
}
</script>

<template>
  <main class="signin-page">
    <!-- LEFT / BRAND -->
    <section class="signin-brand">
      <RouterLink
        to="/signin"
        class="signin-logo"
      >
        <img
          :src="logoAppLight"
          alt="Voyagio"
          class="signin-logo-icon"
        />

        <span class="signin-logo-text">
          Voyagio
        </span>
      </RouterLink>

      <div class="brand-content">
        <p class="brand-eyebrow">
          Your trip starts here
        </p>

        <h1 class="brand-title">
          Travel plans made around you.
        </h1>

        <p class="brand-description">
          Build personalized itineraries, discover places you’ll actually
          enjoy and keep every trip in one place.
        </p>
      </div>

      <p class="brand-footer">
        Plan less. Experience more.
      </p>
    </section>

    <!-- RIGHT / FORM -->
    <section class="signin-form-section">
      <div class="signin-form-container">
        <div class="form-heading">
          <p class="form-eyebrow">
            Welcome back
          </p>

          <h2>
            Sign in to Voyagio
          </h2>

          <p>
            Continue planning your next adventure.
          </p>
        </div>

        <form
          class="signin-form"
          @submit.prevent="handleSignIn"
        >
          <div class="form-field">
            <label for="email">
              Email
            </label>

            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="you@example.com"
              autocomplete="email"
              required
            />
          </div>

          <div class="form-field">
            <div class="password-label-row">
              <label for="password">
                Password
              </label>

              <button
                type="button"
                class="forgot-password"
              >
                Forgot password?
              </button>
            </div>

            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="Enter your password"
              autocomplete="current-password"
              required
            />
          </div>

          <p
            v-if="errorMessage"
            class="message error-message"
          >
            {{ errorMessage }}
          </p>

          <button
            type="submit"
            class="signin-button"
            :disabled="loading"
          >
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>

        <p class="signup-prompt">
          Don't have an account?

          <RouterLink to="/signup">
            Sign up
          </RouterLink>
        </p>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* =========================
   PAGE
========================= */

.signin-page {
  min-height: 100vh;

  display: grid;
  grid-template-columns: minmax(380px, 0.9fr) minmax(520px, 1.1fr);

  background: #fff8ec;
}


/* =========================
   LEFT / BRAND
========================= */

.signin-brand {
  min-height: 100vh;

  padding: 68px 40px 42px;

  display: flex;
  flex-direction: column;

  background: #546b41;
  color: #fff8ec;
}

.signin-logo {
  display: flex;
  align-items: center;

  align-self: flex-start;

  gap: 16px;

  margin: 0;

  color: #fff8ec;
  text-decoration: none;
}

.signin-logo-icon {
  width: 105px;
  height: 105px;

  object-fit: contain;
  flex-shrink: 0;
}

.signin-logo-text {
  font-family: 'Playfair Display', serif;
  font-size: 60px;
  font-weight: 600;
  line-height: 1;

  color: #fff8ec;
}

.brand-content {
  width: min(100%, 520px);

  margin-top: 70px;
}

.brand-eyebrow {
  margin: 0 0 18px;

  color: #dcccac;

  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 700;

  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.brand-title {
  margin: 0 0 22px;

  font-family: 'Playfair Display', serif;
  font-size: clamp(48px, 5vw, 74px);
  font-weight: 600;

  line-height: 1.03;
  letter-spacing: -0.03em;

  color: #fff8ec;
}

.brand-description {
  max-width: 470px;

  margin: 0;

  color: rgba(255, 248, 236, 0.78);

  font-family: 'DM Sans', sans-serif;
  font-size: 17px;
  line-height: 1.7;
}

.brand-footer {
  margin-top: auto;
  margin-bottom: 0;

  color: rgba(255, 248, 236, 0.6);

  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
}


/* =========================
   RIGHT / FORM
========================= */

.signin-form-section {
  min-height: 100vh;

  padding: 48px;

  display: flex;
  align-items: center;
  justify-content: center;
}

.signin-form-container {
  width: min(100%, 460px);
}

.form-heading {
  margin-bottom: 34px;
}

.form-eyebrow {
  margin: 0 0 8px;

  color: #be9264;

  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 700;

  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.form-heading h2 {
  margin: 0 0 12px;

  color: #263025;

  font-family: 'Playfair Display', serif;
  font-size: 42px;
  font-weight: 600;

  line-height: 1.1;
}

.form-heading > p:last-child {
  margin: 0;

  color: rgba(38, 48, 37, 0.64);

  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
}


/* =========================
   FORM
========================= */

.signin-form {
  display: flex;
  flex-direction: column;

  gap: 22px;
}

.form-field {
  display: flex;
  flex-direction: column;

  gap: 8px;
}

.form-field label {
  color: #263025;

  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;
}

.password-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 16px;
}

.forgot-password {
  padding: 0;

  border: none;

  background: transparent;

  color: #546b41;

  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;

  cursor: pointer;
}

.forgot-password:hover {
  text-decoration: underline;
}

.form-field input {
  width: 100%;
  height: 52px;

  padding: 0 16px;

  border: 1px solid rgba(84, 107, 65, 0.2);
  border-radius: 10px;

  outline: none;

  background: rgba(255, 255, 255, 0.6);
  color: #263025;

  font-family: 'DM Sans', sans-serif;
  font-size: 15px;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.form-field input::placeholder {
  color: rgba(38, 48, 37, 0.4);
}

.form-field input:focus {
  border-color: #546b41;

  background: #fff;

  box-shadow: 0 0 0 3px rgba(84, 107, 65, 0.09);
}


/* =========================
   ERROR
========================= */

.message {
  margin: -4px 0 0;

  padding: 11px 13px;

  border-radius: 10px;

  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
}

.error-message {
  border: 1px solid rgba(163, 62, 62, 0.16);

  background: rgba(163, 62, 62, 0.08);

  color: #8e3939;
}


/* =========================
   SIGN IN BUTTON
========================= */

.signin-button {
  width: 100%;
  min-height: 52px;

  padding: 12px 18px;

  border: 1px solid #546b41;
  border-radius: 10px;

  background: #546b41;
  color: #fff8ec;

  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  font-weight: 700;

  cursor: pointer;

  transition:
    background 0.2s ease,
    transform 0.15s ease,
    opacity 0.2s ease;
}

.signin-button:hover:not(:disabled) {
  background: #465b36;
}

.signin-button:active:not(:disabled) {
  transform: translateY(1px);
}

.signin-button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}


/* =========================
   SIGN UP LINK
========================= */

.signup-prompt {
  margin: 24px 0 0;

  text-align: center;

  color: rgba(38, 48, 37, 0.6);

  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
}

.signup-prompt a {
  margin-left: 4px;

  color: #546b41;

  font-weight: 700;
  text-decoration: none;
}

.signup-prompt a:hover {
  text-decoration: underline;
}


/* =========================
   TABLET
========================= */

@media (max-width: 900px) {
  .signin-page {
    grid-template-columns: 1fr;
  }

  .signin-brand {
    min-height: auto;

    padding: 48px 32px 42px;
  }

  .signin-logo {
    align-self: flex-start;

    gap: 14px;
  }

  .signin-logo-icon {
    width: 88px;
    height: 88px;
  }

  .signin-logo-text {
    font-size: 46px;
  }

  .brand-content {
    width: min(100%, 650px);

    margin-top: 55px;
  }

  .brand-title {
    max-width: 650px;

    font-size: clamp(44px, 8vw, 62px);
  }

  .brand-description {
    max-width: 600px;
  }

  .brand-footer {
    display: none;
  }

  .signin-form-section {
    min-height: auto;

    padding: 64px 32px;
  }
}


/* =========================
   MOBILE
========================= */

@media (max-width: 560px) {
  .signin-brand {
    padding: 34px 20px 32px;
  }

  .signin-logo {
    align-self: flex-start;

    gap: 12px;
  }

  .signin-logo-icon {
    width: 76px;
    height: 76px;
  }

  .signin-logo-text {
    font-size: 40px;
  }

  .brand-content {
    margin-top: 38px;
  }

  .brand-eyebrow {
    margin-bottom: 12px;
  }

  .brand-title {
    margin-bottom: 16px;

    font-size: 40px;
  }

  .brand-description {
    font-size: 15px;
  }

  .signin-form-section {
    padding: 44px 20px;
  }

  .form-heading {
    margin-bottom: 28px;
  }

  .form-heading h2 {
    font-size: 34px;
  }

  .password-label-row {
    align-items: flex-start;
  }
}
</style>