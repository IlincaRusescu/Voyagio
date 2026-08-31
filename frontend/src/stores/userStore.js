import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { supabase } from '../lib/supabase'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const profile = ref(null)

  const plan = ref('free')
  const tokenBalance = ref(0)

  const loading = ref(false)
  const errorMessage = ref('')

  const isPremium = computed(() => {
    return plan.value === 'premium'
  })

  async function loadUser() {
    loading.value = true
    errorMessage.value = ''

    const {
      data: { session }
    } = await supabase.auth.getSession()

    if (!session) {
      clearUser()
      loading.value = false
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
        errorMessage.value =
          data.error || 'Could not load user.'

        loading.value = false
        return
      }

      user.value = {
        id: data.id,
        email: data.email
      }

      profile.value = data.profile

      plan.value = data.profile?.plan || 'free'

      tokenBalance.value =
        data.profile?.token_balance || 0
    } catch (error) {
      console.error('User loading error:', error)

      errorMessage.value =
        'Could not connect to the server.'
    }

    loading.value = false
  }

  function clearUser() {
    user.value = null
    profile.value = null

    plan.value = 'free'
    tokenBalance.value = 0

    errorMessage.value = ''
  }

  return {
    user,
    profile,

    plan,
    isPremium,
    tokenBalance,

    loading,
    errorMessage,

    loadUser,
    clearUser
  }
})