<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { supabase } from '../lib/supabase'
import { useUserStore } from '../stores/userStore'

import logoAppLight from '../assets/logo_app_light.svg'

import { countries } from '../data/countries'

import {
  validateFirstName,
  validateLastName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateTerms,
  validateCountry
} from '../utils/signupValidation'

const router = useRouter()
const userStore = useUserStore()

const firstName = ref('')
const lastName = ref('')
const username = ref('')
const country = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const acceptTerms = ref(false)

const firstNameError = ref('')
const lastNameError = ref('')
const usernameError = ref('')
const countryError = ref('')
const emailError = ref('')
const passwordError = ref('')
const confirmPasswordError = ref('')
const termsError = ref('')

const formError = ref('')
const errorMessage = ref('')

const checkingUsername = ref(false)
const loading = ref(false)

function checkFirstName() {
  firstNameError.value = validateFirstName(firstName.value)
  return !firstNameError.value
}

function checkLastName() {
  lastNameError.value = validateLastName(lastName.value)
  return !lastNameError.value
}

async function checkUsername() {
  usernameError.value = ''

  const value = username.value.trim()

  if (!value) {
    usernameError.value = 'Username is required.'
    return false
  }

  if (value.length < 3) {
    usernameError.value = 'Username must be at least 3 characters.'
    return false
  }

  checkingUsername.value = true

  try {
    const response = await fetch(
      `http://localhost:3000/api/validation/username?username=${encodeURIComponent(value)}`
    )

    const data = await response.json()

    if (!response.ok) {
      usernameError.value = 'Could not check username.'
      return false
    }

    if (!data.available) {
      usernameError.value = 'This username is already taken.'
      return false
    }

    return true
  } catch (error) {
    console.error('Username validation error:', error)

    usernameError.value = 'Could not check username.'
    return false
  } finally {
    checkingUsername.value = false
  }
}

function checkCountry() {
  countryError.value = validateCountry(country.value, countries)
  return !countryError.value
}

function checkEmail() {
  emailError.value = validateEmail(email.value)
  return !emailError.value
}

function checkPassword() {
  passwordError.value = validatePassword(password.value)

  if (confirmPassword.value) {
    checkConfirmPassword()
  }

  return !passwordError.value
}

function checkConfirmPassword() {
  confirmPasswordError.value = validateConfirmPassword(
    confirmPassword.value,
    password.value
  )

  return !confirmPasswordError.value
}

function checkTerms() {
  termsError.value = validateTerms(acceptTerms.value)
  return !termsError.value
}

async function handleSignUp() {
  errorMessage.value = ''
  formError.value = ''

  const isFirstNameValid = checkFirstName()
  const isLastNameValid = checkLastName()
  const isUsernameValid = await checkUsername()
  const isCountryValid = checkCountry()
  const isEmailValid = checkEmail()
  const isPasswordValid = checkPassword()
  const isConfirmPasswordValid = checkConfirmPassword()
  const areTermsValid = checkTerms()

  const formIsValid =
    isFirstNameValid &&
    isLastNameValid &&
    isUsernameValid &&
    isCountryValid &&
    isEmailValid &&
    isPasswordValid &&
    isConfirmPasswordValid &&
    areTermsValid

  if (!formIsValid) {
    formError.value = 'Please review the fields above.'
    return
  }

  loading.value = true

  const { data, error: signUpError } = await supabase.auth.signUp({
    email: email.value.trim(),
    password: password.value
  })

  if (signUpError) {
    const duplicateEmail =
      signUpError.message.toLowerCase().includes('already') ||
      signUpError.message.toLowerCase().includes('registered')

    if (duplicateEmail) {
      emailError.value = 'An account already exists for this email address.'
      formError.value = 'Please review the fields above.'
    } else {
      errorMessage.value = signUpError.message
    }

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
      first_name: firstName.value.trim(),
      last_name: lastName.value.trim(),
      username: username.value.trim(),
      country: country.value.trim()
    })

  if (profileError) {
    if (profileError.code === '23505') {
      usernameError.value = 'This username is already taken.'
      formError.value = 'Please review the fields above.'
    } else {
      errorMessage.value = profileError.message
    }

    loading.value = false
    return
  }

  await userStore.loadUser()

  loading.value = false
  router.push('/')
}
</script>

<template>
  <main class="signup-page">
    <!-- LEFT / BRAND -->
    <section class="signup-brand">
      <div class="brand-main">
        <RouterLink
          to="/signup"
          class="signup-logo"
        >
          <img
            :src="logoAppLight"
            alt="Voyagio"
            class="signup-logo-icon"
          />

          <span class="signup-logo-text">
            Voyagio
          </span>
        </RouterLink>

        <div class="brand-content">
          <p class="brand-eyebrow">
            Start your journey
          </p>

          <h1 class="brand-title">
            Your trips, your way.
          </h1>

          <p class="brand-description">
            Create your account and start building travel plans tailored to how
            you actually like to explore.
          </p>
        </div>
      </div>

      <p class="brand-footer">
        Plan less. Experience more.
      </p>
    </section>

    <!-- RIGHT / FORM -->
    <section class="signup-form-section">
      <div class="signup-form-container">
        <div class="form-heading">
          <p class="form-eyebrow">
            Join Voyagio
          </p>

          <h2>
            Create your account
          </h2>

          <p>
            Tell us a few details and you're ready to start planning.
          </p>
        </div>

        <form
          class="signup-form"
          @submit.prevent="handleSignUp"
        >
          <!-- FIRST + LAST NAME -->
          <div class="form-row">
            <div class="form-field">
              <label for="first-name">
                First name
              </label>

              <input
                id="first-name"
                v-model="firstName"
                type="text"
                placeholder="First name"
                autocomplete="given-name"
                :class="{ 'input-error': firstNameError }"
                @blur="checkFirstName"
              />

              <p
                v-if="firstNameError"
                class="field-error"
              >
                {{ firstNameError }}
              </p>
            </div>

            <div class="form-field">
              <label for="last-name">
                Last name
              </label>

              <input
                id="last-name"
                v-model="lastName"
                type="text"
                placeholder="Last name"
                autocomplete="family-name"
                :class="{ 'input-error': lastNameError }"
                @blur="checkLastName"
              />

              <p
                v-if="lastNameError"
                class="field-error"
              >
                {{ lastNameError }}
              </p>
            </div>
          </div>

          <!-- USERNAME + COUNTRY -->
          <div class="form-row">
            <div class="form-field">
              <label for="username">
                Username
              </label>

              <input
                id="username"
                v-model="username"
                type="text"
                placeholder="Choose a username"
                autocomplete="username"
                :class="{ 'input-error': usernameError }"
                @blur="checkUsername"
              />

              <p
                v-if="checkingUsername"
                class="field-helper"
              >
                Checking username...
              </p>

              <p
                v-else-if="usernameError"
                class="field-error"
              >
                {{ usernameError }}
              </p>
            </div>

            <div class="form-field">
              <label for="country">
                Country
              </label>

              <input
                id="country"
                v-model="country"
                type="text"
                placeholder="Your country"
                autocomplete="country-name"
                :class="{ 'input-error': countryError }"
                @blur="checkCountry"
              />

              <p
                v-if="countryError"
                class="field-error"
              >
                {{ countryError }}
              </p>
            </div>
          </div>

          <!-- EMAIL -->
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
              :class="{ 'input-error': emailError }"
              @blur="checkEmail"
            />

            <p
              v-if="emailError"
              class="field-error"
            >
              {{ emailError }}
            </p>
          </div>

          <!-- PASSWORDS -->
          <div class="form-row">
            <div class="form-field">
              <label for="password">
                Password
              </label>

              <input
                id="password"
                v-model="password"
                type="password"
                placeholder="Create a password"
                autocomplete="new-password"
                :class="{ 'input-error': passwordError }"
                @blur="checkPassword"
              />

              <p
                v-if="passwordError"
                class="field-error"
              >
                {{ passwordError }}
              </p>
            </div>

            <div class="form-field">
              <label for="confirm-password">
                Confirm password
              </label>

              <input
                id="confirm-password"
                v-model="confirmPassword"
                type="password"
                placeholder="Repeat password"
                autocomplete="new-password"
                :class="{ 'input-error': confirmPasswordError }"
                @blur="checkConfirmPassword"
              />

              <p
                v-if="confirmPasswordError"
                class="field-error"
              >
                {{ confirmPasswordError }}
              </p>
            </div>
          </div>

          <!-- TERMS -->
          <div class="terms-wrapper">
            <label
              class="terms-row"
              :class="{ 'terms-error': termsError }"
            >
              <input
                v-model="acceptTerms"
                type="checkbox"
                @change="checkTerms"
              />

              <span>
                I agree to the
                <a href="#">
                  Terms
                </a>
                &
                <a href="#">
                  Privacy Policy
                </a>
              </span>
            </label>

            <p
              v-if="termsError"
              class="field-error"
            >
              {{ termsError }}
            </p>
          </div>

          <!-- FORM VALIDATION ERROR -->
          <p
            v-if="formError"
            class="message error-message"
          >
            {{ formError }}
          </p>

          <!-- BACKEND / SIGNUP ERROR -->
          <p
            v-if="errorMessage"
            class="message error-message"
          >
            {{ errorMessage }}
          </p>

          <!-- SUBMIT -->
          <button
            type="submit"
            class="signup-button"
            :disabled="loading || checkingUsername"
          >
            {{ loading ? 'Creating account...' : 'Create account' }}
          </button>
        </form>

        <p class="signin-prompt">
          Already have an account?

          <RouterLink to="/signin">
            Sign in
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

.signup-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(380px, 0.9fr) minmax(560px, 1.1fr);
  background: #fff8ec;
}

/* =========================
   LEFT / BRAND
========================= */

.signup-brand {
  min-height: 100vh;
  padding: 42px 40px;
  display: flex;
  flex-direction: column;
  background: #546b41;
  color: #fff8ec;
}

/*
  Contains:
  - Voyagio logo
  - Start your journey
  - Main title
  - Description

  On desktop this whole group is vertically centered
  and moved slightly lower for better visual balance.
*/
.brand-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.signup-logo {
  display: flex;
  align-items: center;
  align-self: flex-start;
  gap: 16px;
  color: #fff8ec;
  text-decoration: none;
}

.signup-logo-icon {
  width: 105px;
  height: 105px;
  object-fit: contain;
  flex-shrink: 0;
}

.signup-logo-text {
  font-family: 'Playfair Display', serif;
  font-size: 65px;
  font-weight: 600;
  line-height: 1;
  color: #fff8ec;
}

.brand-content {
  width: min(100%, 520px);
  margin-top: 70px;
  margin-bottom: 70px;
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
  margin: 0;
  color: rgba(255, 248, 236, 0.6);
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
}

/* =========================
   RIGHT / FORM
========================= */

.signup-form-section {
  min-height: 100vh;
  padding: 44px 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.signup-form-container {
  width: min(100%, 620px);
}

.form-heading {
  margin-bottom: 30px;
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
  margin: 0 0 10px;
  color: #263025;
  font-family: 'Playfair Display', serif;
  font-size: 40px;
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

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
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

.form-field input {
  width: 100%;
  height: 50px;
  padding: 0 15px;
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
   FIELD VALIDATION
========================= */

.form-field input.input-error {
  border-color: #b94a48;
}

.form-field input.input-error:focus {
  border-color: #b94a48;
  box-shadow: 0 0 0 3px rgba(185, 74, 72, 0.1);
}

.field-error {
  margin: -2px 0 0;
  color: #a33e3e;
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  line-height: 1.4;
}

.field-helper {
  margin: -2px 0 0;
  color: rgba(38, 48, 37, 0.55);
  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  line-height: 1.4;
}

/* =========================
   TERMS
========================= */

.terms-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.terms-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: rgba(38, 48, 37, 0.7);
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  line-height: 1.5;
  cursor: pointer;
}

.terms-row input {
  width: 16px;
  height: 16px;
  margin-top: 2px;
  accent-color: #546b41;
  flex-shrink: 0;
}

.terms-row a {
  color: #546b41;
  font-weight: 600;
  text-decoration: none;
}

.terms-row a:hover {
  text-decoration: underline;
}

.terms-row.terms-error {
  color: #a33e3e;
}

.terms-row.terms-error a {
  color: #a33e3e;
}

/* =========================
   ERROR
========================= */

.message {
  margin: -2px 0 0;
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
   BUTTON
========================= */

.signup-button {
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

.signup-button:hover:not(:disabled) {
  background: #465b36;
}

.signup-button:active:not(:disabled) {
  transform: translateY(1px);
}

.signup-button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

/* =========================
   SIGN IN LINK
========================= */

.signin-prompt {
  margin: 22px 0 0;
  text-align: center;
  color: rgba(38, 48, 37, 0.6);
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
}

.signin-prompt a {
  margin-left: 4px;
  color: #546b41;
  font-weight: 700;
  text-decoration: none;
}

.signin-prompt a:hover {
  text-decoration: underline;
}

/* =========================
   TABLET
========================= */

@media (max-width: 900px) {
  .signup-page {
    grid-template-columns: 1fr;
  }

  .signup-brand {
    min-height: auto;
    padding: 48px 32px 42px;
  }

  /*
    On tablet the green section is no longer full-screen,
    so we don't force vertical centering.
  */
  .brand-main {
    flex: initial;
    justify-content: flex-start;
    transform: none;
  }

  .signup-logo-icon {
    width: 88px;
    height: 88px;
  }

  .signup-logo-text {
    font-size: 50px;
  }

  .brand-content {
    width: min(100%, 650px);
    margin-top: 48px;
    margin-bottom: 48px;
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

  .signup-form-section {
    min-height: auto;
    padding: 58px 32px;
  }
}

/* =========================
   MOBILE
========================= */

@media (max-width: 600px) {
  .signup-brand {
    padding: 34px 20px 32px;
  }

  .signup-logo {
    gap: 12px;
  }

  .signup-logo-icon {
    width: 76px;
    height: 76px;
  }

  .signup-logo-text {
    font-size: 42px;
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

  .signup-form-section {
    padding: 42px 20px;
  }

  .signup-form-container {
    width: 100%;
  }

  .form-heading {
    margin-bottom: 26px;
  }

  .form-heading h2 {
    font-size: 34px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 18px;
  }
}
</style>