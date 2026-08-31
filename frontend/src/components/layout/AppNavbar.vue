<template>
  <header class="app-navbar">
    <div class="navbar-inner">
      <!-- BRAND -->
      <RouterLink to="/" class="brand">
        <img
          :src="logoAppLight"
          alt="Voyagio"
          class="brand-logo"
        />

        <span class="brand-name">
          Voyagio
        </span>
      </RouterLink>

      <!-- DESKTOP NAVIGATION -->
      <nav class="desktop-nav">
        <RouterLink to="/" class="nav-link">
          Home
        </RouterLink>

        <RouterLink to="/create-trip" class="nav-link">
          Create Trip
        </RouterLink>

        <RouterLink to="/my-trips" class="nav-link">
          My Trips
        </RouterLink>

        <RouterLink to="/community" class="nav-link">
          Community
        </RouterLink>
      </nav>

      <!-- DESKTOP ACTIONS -->
      <div class="desktop-actions">
        <!-- PREMIUM -->
        <button
          v-if="!isPremium"
          type="button"
          class="premium-button"
        >
          Upgrade to Premium
        </button>

        <!-- TOKENS -->
        <button
          type="button"
          class="tokens-button"
        >
          <img
            :src="logoTokensLight"
            alt=""
            class="token-icon"
          />

          <span>0</span>
        </button>

        <!-- PROFILE DROPDOWN -->
        <div class="profile-menu-wrapper">
          <button
            type="button"
            class="profile-button"
          >
            Hi, {{ firstName || 'Traveler' }}
          </button>

          <div class="profile-dropdown">
            <RouterLink
              to="/profile"
              class="dropdown-link"
            >
              Profile
            </RouterLink>

            <RouterLink
              to="/tokens"
              class="dropdown-link"
            >
              Tokens
            </RouterLink>

            <RouterLink
              to="/badges"
              class="dropdown-link"
            >
              Badges
            </RouterLink>

            <RouterLink
              to="/settings"
              class="dropdown-link"
            >
              Settings
            </RouterLink>
          </div>
        </div>

        <!-- LOG OUT -->
        <button
          type="button"
          class="logout-button"
          @click="handleLogout"
        >
          Log out
        </button>
      </div>

      <!-- MOBILE HAMBURGER -->
      <button
        type="button"
        class="menu-button"
        aria-label="Open menu"
        :aria-expanded="mobileMenuOpen"
        @click="toggleMobileMenu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <!-- MOBILE MENU -->
    <div
      v-if="mobileMenuOpen"
      class="mobile-menu"
    >
      <RouterLink
        to="/"
        class="mobile-link"
        @click="closeMobileMenu"
      >
        Home
      </RouterLink>

      <RouterLink
        to="/create-trip"
        class="mobile-link"
        @click="closeMobileMenu"
      >
        Create Trip
      </RouterLink>

      <RouterLink
        to="/my-trips"
        class="mobile-link"
        @click="closeMobileMenu"
      >
        My Trips
      </RouterLink>

      <RouterLink
        to="/community"
        class="mobile-link"
        @click="closeMobileMenu"
      >
        Community
      </RouterLink>

      <div class="mobile-divider"></div>

      <button
        v-if="!isPremium"
        type="button"
        class="mobile-premium"
      >
        Upgrade to Premium
      </button>

      <div class="mobile-tokens">
        <img
          :src="logoTokensLight"
          alt=""
          class="token-icon"
        />

        <span>0 tokens</span>
      </div>

      <RouterLink
        to="/profile"
        class="mobile-link"
        @click="closeMobileMenu"
      >
        Profile
      </RouterLink>

      <RouterLink
        to="/tokens"
        class="mobile-link"
        @click="closeMobileMenu"
      >
        Tokens
      </RouterLink>

      <RouterLink
        to="/badges"
        class="mobile-link"
        @click="closeMobileMenu"
      >
        Badges
      </RouterLink>

      <RouterLink
        to="/settings"
        class="mobile-link"
        @click="closeMobileMenu"
      >
        Settings
      </RouterLink>

      <button
        type="button"
        class="mobile-logout"
        @click="handleLogout"
      >
        Log out
      </button>
    </div>
  </header>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { supabase } from '../../lib/supabase'

import logoAppLight from '../../assets/logo_app_light.svg'
import logoTokensLight from '../../assets/logo_tokens_light.svg'

const router = useRouter()

const mobileMenuOpen = ref(false)
const isPremium = ref(false)
const firstName = ref('')

async function loadUserProfile() {
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) {
    return
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('first_name')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Profile loading error:', error)
    return
  }

  firstName.value = data?.first_name || ''
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

async function handleLogout() {
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Logout error:', error)
    return
  }

  closeMobileMenu()

  router.push('/signin')
}

onMounted(() => {
  loadUserProfile()
})
</script>

<style scoped>
/* =========================
   NAVBAR
========================= */

.app-navbar {
  position: sticky;
  top: 0;
  z-index: 1000;

  width: 100%;

  background: #546b41;
  border-bottom: 1px solid rgba(255, 248, 236, 0.12);
}

.navbar-inner {
  width: 100%;
  min-height: 88px;

  padding: 0 40px;

  display: flex;
  align-items: center;

  gap: 34px;
}


/* =========================
   BRAND
========================= */

.brand {
  display: flex;
  align-items: center;

  gap: 10px;

  flex-shrink: 0;

  text-decoration: none;
}

.brand-logo {
  width: 72px;
  height: 72px;

  object-fit: contain;

  flex-shrink: 0;
}

.brand-name {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-weight: 600;

  line-height: 1;

  color: #fff8ec;
}


/* =========================
   DESKTOP NAVIGATION
========================= */

.desktop-nav {
  display: flex;
  align-items: center;

  gap: 28px;

  margin-left: 18px;
}

.nav-link {
  position: relative;

  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  font-weight: 500;

  color: rgba(255, 248, 236, 0.82);

  text-decoration: none;

  transition: color 0.2s ease;
}

.nav-link:hover {
  color: #fff8ec;
}

.nav-link.router-link-active {
  color: #fff8ec;
}

.nav-link.router-link-active::after {
  content: '';

  position: absolute;

  left: 0;
  right: 0;
  bottom: -12px;

  height: 2px;

  border-radius: 999px;

  background: #dcccac;
}


/* =========================
   DESKTOP ACTIONS
========================= */

.desktop-actions {
  margin-left: auto;

  display: flex;
  align-items: center;

  gap: 16px;
}


/* =========================
   PREMIUM
========================= */

.premium-button {
  padding: 10px 16px;

  border: 1px solid #dcccac;
  border-radius: 10px;

  background: #dcccac;

  color: #546b41;

  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;

  cursor: pointer;

  transition:
    background 0.2s ease,
    border-color 0.2s ease;
}

.premium-button:hover {
  background: #fff8ec;
  border-color: #fff8ec;
}


/* =========================
   TOKENS
========================= */

.tokens-button {
  display: flex;
  align-items: center;

  gap: 8px;

  padding: 9px 13px;

  border: 1px solid rgba(255, 248, 236, 0.22);
  border-radius: 10px;

  background: rgba(255, 248, 236, 0.1);

  color: #fff8ec;

  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;

  cursor: pointer;

  transition:
    background 0.2s ease,
    border-color 0.2s ease;
}

.tokens-button:hover {
  background: rgba(255, 248, 236, 0.17);

  border-color: rgba(255, 248, 236, 0.35);
}

.token-icon {
  width: 26px;
  height: 26px;

  object-fit: contain;

  flex-shrink: 0;
}


/* =========================
   PROFILE
========================= */

.profile-menu-wrapper {
  position: relative;

  display: flex;
  align-items: center;
}

.profile-button {
  padding: 10px 4px;

  border: none;

  background: transparent;

  color: #fff8ec;

  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  font-weight: 500;

  cursor: pointer;

  transition: color 0.2s ease;
}

.profile-button:hover {
  color: #dcccac;
}


/* =========================
   PROFILE DROPDOWN
========================= */

.profile-dropdown {
  position: absolute;

  top: calc(100% + 4px);
  left: 50%;

  width: 128px;

  padding: 7px;

  border: 1px solid rgba(84, 107, 65, 0.14);
  border-radius: 12px;

  background: #fff8ec;

  box-shadow:
    0 12px 30px rgba(38, 48, 37, 0.14);

  opacity: 0;
  visibility: hidden;

  transform: translate(-50%, -6px);

  pointer-events: none;

  transition:
    opacity 0.18s ease,
    transform 0.18s ease,
    visibility 0.18s ease;
}

.profile-menu-wrapper:hover .profile-dropdown {
  opacity: 1;
  visibility: visible;

  transform: translate(-50%, 0);

  pointer-events: auto;
}

.dropdown-link {
  display: block;

  padding: 10px 8px;

  border-radius: 8px;

  color: #263025;

  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 500;

  text-align: center;
  text-decoration: none;

  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.dropdown-link:hover {
  background: rgba(153, 173, 122, 0.18);

  color: #546b41;
}


/* =========================
   LOG OUT
========================= */

.logout-button {
  padding: 9px 15px;

  border: 1px solid #fff8ec;
  border-radius: 10px;

  background: transparent;

  color: #fff8ec;

  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 600;

  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.logout-button:hover {
  background: #fff8ec;

  color: #546b41;
}


/* =========================
   HAMBURGER
========================= */

.menu-button {
  display: none;

  margin-left: auto;

  width: 44px;
  height: 44px;

  padding: 0;

  border: none;
  border-radius: 10px;

  background: transparent;

  cursor: pointer;
}

.menu-button:hover {
  background: rgba(255, 248, 236, 0.1);
}

.menu-button span {
  display: block;

  width: 22px;
  height: 2px;

  margin: 5px auto;

  border-radius: 999px;

  background: #fff8ec;
}


/* =========================
   MOBILE MENU
========================= */

.mobile-menu {
  display: none;
}


/* =========================
   TABLET + MOBILE
========================= */

@media (max-width: 900px) {
  .navbar-inner {
    min-height: 78px;

    padding: 0 20px;
  }

  .desktop-nav,
  .desktop-actions {
    display: none;
  }

  .menu-button {
    display: block;
  }

  .brand-logo {
    width: 58px;
    height: 58px;
  }

  .brand-name {
    font-size: 27px;
  }

  .mobile-menu {
    display: flex;
    flex-direction: column;

    gap: 4px;

    padding: 12px 16px 20px;

    background: #546b41;

    border-top: 1px solid rgba(255, 248, 236, 0.12);
  }

  .mobile-link {
    padding: 13px 12px;

    border-radius: 10px;

    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 500;

    color: #fff8ec;

    text-decoration: none;

    text-align: left;
  }

  .mobile-link:hover,
  .mobile-link.router-link-active {
    background: rgba(255, 248, 236, 0.1);

    color: #fff8ec;
  }

  .mobile-divider {
    height: 1px;

    margin: 8px 0;

    background: rgba(255, 248, 236, 0.14);
  }

  .mobile-premium {
    margin-bottom: 4px;

    padding: 12px;

    border: 1px solid #dcccac;
    border-radius: 10px;

    background: #dcccac;

    color: #546b41;

    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;

    cursor: pointer;
  }

  .mobile-tokens {
    display: flex;
    align-items: center;

    gap: 8px;

    padding: 13px 12px;

    color: #fff8ec;

    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
  }

  .mobile-logout {
    margin-top: 8px;

    padding: 12px;

    border: 1px solid #fff8ec;
    border-radius: 10px;

    background: transparent;

    color: #fff8ec;

    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;

    cursor: pointer;
  }

  .mobile-logout:hover {
    background: #fff8ec;

    color: #546b41;
  }
}


/* =========================
   SMALL PHONES
========================= */

@media (max-width: 520px) {
  .navbar-inner {
    min-height: 72px;

    padding: 0 14px;
  }

  .brand {
    gap: 8px;
  }

  .brand-logo {
    width: 52px;
    height: 52px;
  }

  .brand-name {
    font-size: 24px;
  }
}
</style>