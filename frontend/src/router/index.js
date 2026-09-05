import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import SignIn from '../views/SignIn.vue'
import SignUp from '../views/SignUp.vue'
import { supabase } from '../lib/supabase'
import CreateTripView from '../views/CreateTripView.vue'
import ItineraryView from '../views/ItineraryView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/signin',
    name: 'signin',
    component: SignIn
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignUp
  },
  {
  path: '/create-trip',
  name: 'create-trip',
  component: CreateTripView,
  meta: {
    requiresAuth: true
  }
  },
  {
  path: '/itinerary',
  name: 'itinerary',
  component: ItineraryView,
  meta: {
    requiresAuth: true
  }
}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to) => {
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (to.meta.requiresAuth && !session) {
    return '/signin'
  }
})

export default router