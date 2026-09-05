<script setup>
import { onMounted, ref } from 'vue'
import { supabase } from '../lib/supabase'
import { useRouter } from 'vue-router'

const userEmail = ref('')
const firstName = ref('')
const loading = ref(true)
const errorMessage = ref('')

const router = useRouter()

// Temporary placeholders.
// Later these will come from the backend/database.
const plannedTrips = ref(0)
const unlockedBadges = ref(0)

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

function goToCreateTrip() {
  router.push('/create-trip')
}

function goToMyTrips() {
  router.push('/my-trips')
}

function goToBadges() {
  router.push('/badges')
}

function goToCommunity() {
  router.push('/community')
}

onMounted(() => {
  loadUser()
})
</script>

<template>
  <main class="home-page">
    <div class="home-container">
      <p
        v-if="loading"
        class="state-message"
      >
        Loading...
      </p>

      <p
        v-else-if="errorMessage"
        class="state-message error-message"
      >
        {{ errorMessage }}
      </p>

      <template v-else>
        <!-- HERO -->
        <section class="hero-section">
          <div class="hero-copy">
            <p class="eyebrow">
              WELCOME BACK
            </p>

            <h1>
              Where to next,
              <span>{{ firstName }}?</span>
            </h1>

            <p class="hero-description">
              Your next trip starts with a few preferences.
              Tell Voyagio what you have in mind and build an itinerary around
              the way you actually like to travel.
            </p>

            <button
              type="button"
              class="primary-button"
              @click="goToCreateTrip"
            >
              Plan a new trip
              <span aria-hidden="true">→</span>
            </button>
          </div>

          <div class="hero-decoration">
            <p class="hero-decoration-label">
              TRAVEL, YOUR WAY
            </p>

            <p class="hero-decoration-text">
              Less generic planning.
              More trips that feel like yours.
            </p>
          </div>
        </section>


        <!-- MAIN DASHBOARD CARDS -->
        <section class="dashboard-cards">
          <article
            class="dashboard-card"
            role="button"
            tabindex="0"
            @click="goToMyTrips"
            @keydown.enter="goToMyTrips"
          >
            <div>
              <p class="dashboard-card-label">
                PLANNED TRIPS
              </p>

              <p class="dashboard-card-value">
                {{ plannedTrips }}
              </p>

              <p class="dashboard-card-description">
                Saved itineraries in your Voyagio account.
              </p>
            </div>

            <span class="dashboard-card-link">
              View My Trips →
            </span>
          </article>

          <article
            class="dashboard-card"
            role="button"
            tabindex="0"
            @click="goToBadges"
            @keydown.enter="goToBadges"
          >
            <div>
              <p class="dashboard-card-label">
                MY BADGES
              </p>

              <p class="dashboard-card-value">
                {{ unlockedBadges }}
              </p>

              <p class="dashboard-card-description">
                Milestones and rewards earned through your travels.
              </p>
            </div>

            <span class="dashboard-card-link">
              View My Badges →
            </span>
          </article>
        </section>


        <!-- TRAVEL PROGRESS / BADGES -->
        <section class="progress-section">
          <div class="progress-copy">
            <p class="eyebrow">
              YOUR TRAVEL PROGRESS
            </p>

            <h2>
              Every trip tells a story.
            </h2>

            <p>
              Your Voyagio badges will live here as you explore new places,
              experiences and travel styles.
            </p>
          </div>

          <div class="badge-preview">
            <div class="badge-placeholder">
              <span>Explorer</span>
            </div>

            <div class="badge-placeholder">
              <span>Culture</span>
            </div>

            <div class="badge-placeholder">
              <span>Hidden Gems</span>
            </div>

            <div class="badge-placeholder faded-badge">
              <span>More soon</span>
            </div>
          </div>
        </section>


        <!-- EXPLORE -->
        <section class="explore-section">
          <div class="section-heading">
            <p class="eyebrow">
              KEEP EXPLORING
            </p>

            <h2>
              Your Voyagio
            </h2>

            <p>
              Pick up where you left off or find inspiration for somewhere new.
            </p>
          </div>

          <div class="explore-grid">
            <article
              class="explore-card"
              role="button"
              tabindex="0"
              @click="goToCreateTrip"
              @keydown.enter="goToCreateTrip"
            >
              <div class="card-number">
                01
              </div>

              <div class="card-content">
                <h3>
                  Plan a Trip
                </h3>

                <p>
                  Build a new personalized itinerary from your destination,
                  interests and travel style.
                </p>
              </div>

              <span class="card-link">
                Start planning →
              </span>
            </article>

            <article
              class="explore-card"
              role="button"
              tabindex="0"
              @click="goToMyTrips"
              @keydown.enter="goToMyTrips"
            >
              <div class="card-number">
                02
              </div>

              <div class="card-content">
                <h3>
                  My Trips
                </h3>

                <p>
                  Find your saved itineraries and return to your travel plans
                  whenever you need them.
                </p>
              </div>

              <span class="card-link">
                View my trips →
              </span>
            </article>

            <article
              class="explore-card"
              role="button"
              tabindex="0"
              @click="goToCommunity"
              @keydown.enter="goToCommunity"
            >
              <div class="card-number">
                03
              </div>

              <div class="card-content">
                <h3>
                  Community
                </h3>

                <p>
                  Discover travel stories, recommendations and inspiration
                  shared by other travelers.
                </p>
              </div>

              <span class="card-link">
                Explore community →
              </span>
            </article>
          </div>
        </section>


        <!-- COMMUNITY PREVIEW -->
        <section class="community-preview">
          <div>
            <p class="eyebrow">
              FROM THE COMMUNITY
            </p>

            <h2>
              Inspiration is coming.
            </h2>

            <p>
              Once the Voyagio community is live, this space can surface
              stories, guides and travel ideas directly on your homepage.
            </p>
          </div>

          <button
            type="button"
            class="secondary-button"
            @click="goToCommunity"
          >
            Explore Community
          </button>
        </section>
      </template>
    </div>
  </main>
</template>

<style scoped>
.home-page {
  min-height: calc(100vh - 88px);

  background: #fff8ec;

  color: #263025;
}

.home-container {
  width: min(100% - 48px, 1280px);

  margin: 0 auto;

  padding: 72px 0 88px;
}


/* =========================
   STATES
========================= */

.state-message {
  margin: 0;

  padding: 60px 0;

  font-family: 'DM Sans', sans-serif;
  font-size: 16px;

  color: #546b41;
}

.error-message {
  color: #8a4f3d;
}


/* =========================
   COMMON
========================= */

.eyebrow {
  margin: 0 0 16px;

  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.16em;

  color: #be9264;
}

.primary-button,
.secondary-button {
  min-height: 50px;

  padding: 0 22px;

  border-radius: 10px;

  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  font-weight: 600;

  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.primary-button {
  display: inline-flex;
  align-items: center;

  gap: 12px;

  margin-top: 34px;

  border: 1px solid #546b41;

  background: #546b41;

  color: #fff8ec;
}

.primary-button:hover {
  background: #455936;

  border-color: #455936;

  transform: translateY(-1px);
}

.secondary-button {
  border: 1px solid rgba(84, 107, 65, 0.32);

  background: transparent;

  color: #546b41;
}

.secondary-button:hover {
  border-color: #546b41;

  background: rgba(153, 173, 122, 0.12);
}


/* =========================
   HERO
========================= */

.hero-section {
  min-height: 430px;

  display: grid;

  grid-template-columns:
    minmax(0, 1.25fr)
    minmax(300px, 0.75fr);

  gap: 72px;

  align-items: center;
}

.hero-copy {
  max-width: 760px;
}

.hero-copy h1 {
  max-width: 760px;

  margin: 0;

  font-family: 'Playfair Display', serif;

  font-size: clamp(50px, 6vw, 78px);
  font-weight: 600;

  line-height: 1;

  color: #263025;
}

.hero-copy h1 span {
  color: #546b41;
}

.hero-description {
  max-width: 650px;

  margin: 26px 0 0;

  font-family: 'DM Sans', sans-serif;

  font-size: 18px;
  line-height: 1.7;

  color: #66705f;
}

.hero-decoration {
  min-height: 285px;

  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  padding: 34px;

  border-radius: 16px;

  background: #dcccac;
}

.hero-decoration-label {
  margin: 0 0 12px;

  font-family: 'DM Sans', sans-serif;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.16em;

  color: #546b41;
}

.hero-decoration-text {
  max-width: 310px;

  margin: 0;

  font-family: 'Playfair Display', serif;

  font-size: 32px;
  line-height: 1.12;

  color: #263025;
}


/* =========================
   DASHBOARD CARDS
========================= */

.dashboard-cards {
  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 18px;

  margin-top: 64px;
}

.dashboard-card {
  min-height: 230px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: 30px;

  border: 1px solid rgba(84, 107, 65, 0.14);
  border-radius: 14px;

  background: rgba(255, 255, 255, 0.36);

  cursor: pointer;

  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;
}

.dashboard-card:hover {
  transform: translateY(-3px);

  border-color: rgba(84, 107, 65, 0.32);

  background: rgba(255, 255, 255, 0.58);
}

.dashboard-card-label {
  margin: 0 0 18px;

  font-family: 'DM Sans', sans-serif;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.15em;

  color: #be9264;
}

.dashboard-card-value {
  margin: 0;

  font-family: 'Playfair Display', serif;

  font-size: 58px;
  font-weight: 600;

  line-height: 1;

  color: #546b41;
}

.dashboard-card-description {
  max-width: 320px;

  margin: 16px 0 0;

  font-family: 'DM Sans', sans-serif;

  font-size: 14px;
  line-height: 1.6;

  color: #6b7466;
}

.dashboard-card-link {
  margin-top: 28px;

  font-family: 'DM Sans', sans-serif;

  font-size: 14px;
  font-weight: 700;

  color: #546b41;
}


/* =========================
   PROGRESS / BADGES
========================= */

.progress-section {
  display: grid;

  grid-template-columns:
    minmax(0, 0.85fr)
    minmax(0, 1.15fr);

  gap: 64px;

  align-items: center;

  margin-top: 110px;

  padding: 56px;

  border-radius: 16px;

  background: #99ad7a;
}

.progress-section .eyebrow {
  color: #fff8ec;
}

.progress-copy h2 {
  margin: 0;

  font-family: 'Playfair Display', serif;

  font-size: 40px;
  font-weight: 600;

  color: #263025;
}

.progress-copy > p:last-child {
  margin: 16px 0 0;

  font-family: 'DM Sans', sans-serif;

  font-size: 15px;
  line-height: 1.65;

  color: #3f4b38;
}

.badge-preview {
  display: grid;

  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 14px;
}

.badge-placeholder {
  min-height: 115px;

  display: flex;
  align-items: flex-end;

  padding: 20px;

  border: 1px solid rgba(38, 48, 37, 0.12);
  border-radius: 12px;

  background: rgba(255, 248, 236, 0.76);
}

.badge-placeholder span {
  font-family: 'DM Sans', sans-serif;

  font-size: 14px;
  font-weight: 700;

  color: #263025;
}

.faded-badge {
  opacity: 0.52;
}


/* =========================
   EXPLORE
========================= */

.explore-section {
  margin-top: 110px;
}

.section-heading {
  max-width: 650px;

  margin-bottom: 32px;
}

.section-heading h2 {
  margin: 0;

  font-family: 'Playfair Display', serif;

  font-size: 42px;
  font-weight: 600;

  color: #263025;
}

.section-heading > p:last-child {
  margin: 14px 0 0;

  font-family: 'DM Sans', sans-serif;

  font-size: 15px;
  line-height: 1.65;

  color: #71796d;
}

.explore-grid {
  display: grid;

  grid-template-columns: repeat(3, minmax(0, 1fr));

  gap: 18px;
}

.explore-card {
  min-height: 300px;

  display: flex;
  flex-direction: column;

  padding: 28px;

  border: 1px solid rgba(84, 107, 65, 0.14);
  border-radius: 14px;

  background: rgba(255, 255, 255, 0.32);

  cursor: pointer;

  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;
}

.explore-card:hover {
  transform: translateY(-3px);

  border-color: rgba(84, 107, 65, 0.3);

  background: rgba(255, 255, 255, 0.58);
}

.card-number {
  font-family: 'DM Sans', sans-serif;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.14em;

  color: #be9264;
}

.card-content {
  margin-top: 34px;
}

.card-content h3 {
  margin: 0;

  font-family: 'Playfair Display', serif;

  font-size: 28px;
  font-weight: 600;

  color: #263025;
}

.card-content p {
  margin: 12px 0 0;

  font-family: 'DM Sans', sans-serif;

  font-size: 14px;
  line-height: 1.65;

  color: #697164;
}

.card-link {
  margin-top: auto;

  padding-top: 28px;

  font-family: 'DM Sans', sans-serif;

  font-size: 14px;
  font-weight: 700;

  color: #546b41;
}


/* =========================
   COMMUNITY PREVIEW
========================= */

.community-preview {
  display: flex;

  align-items: flex-end;
  justify-content: space-between;

  gap: 48px;

  margin-top: 110px;

  padding-top: 54px;

  border-top: 1px solid rgba(84, 107, 65, 0.16);
}

.community-preview > div {
  max-width: 680px;
}

.community-preview h2 {
  margin: 0;

  font-family: 'Playfair Display', serif;

  font-size: 40px;
  font-weight: 600;

  color: #263025;
}

.community-preview div > p:last-child {
  margin: 15px 0 0;

  font-family: 'DM Sans', sans-serif;

  font-size: 15px;
  line-height: 1.65;

  color: #71796d;
}


/* =========================
   TABLET
========================= */

@media (max-width: 980px) {
  .home-container {
    padding-top: 54px;
  }

  .hero-section {
    grid-template-columns: 1fr;

    gap: 34px;
  }

  .hero-decoration {
    max-width: 620px;

    min-height: 230px;
  }

  .dashboard-cards {
    grid-template-columns: 1fr;
  }

  .progress-section {
    grid-template-columns: 1fr;

    gap: 38px;
  }

  .explore-grid {
    grid-template-columns: 1fr;
  }

  .explore-card {
    min-height: 220px;
  }
}


/* =========================
   MOBILE
========================= */

@media (max-width: 600px) {
  .home-page {
    min-height: calc(100vh - 72px);
  }

  .home-container {
    width: calc(100% - 32px);

    padding: 42px 0 60px;
  }

  .hero-section {
    min-height: auto;
  }

  .hero-copy h1 {
    font-size: 46px;
  }

  .hero-description {
    font-size: 16px;
  }

  .primary-button {
    width: 100%;

    justify-content: space-between;
  }

  .hero-decoration {
    min-height: 200px;

    padding: 26px;
  }

  .hero-decoration-text {
    font-size: 28px;
  }

  .dashboard-cards {
    margin-top: 48px;
  }

  .dashboard-card {
    min-height: 210px;

    padding: 24px;
  }

  .dashboard-card-value {
    font-size: 48px;
  }

  .progress-section {
    margin-top: 78px;

    padding: 28px 22px;
  }

  .section-heading h2,
  .progress-copy h2,
  .community-preview h2 {
    font-size: 32px;
  }

  .badge-preview {
    grid-template-columns: 1fr 1fr;

    gap: 10px;
  }

  .badge-placeholder {
    min-height: 100px;

    padding: 16px;
  }

  .explore-section {
    margin-top: 78px;
  }

  .explore-card {
    padding: 24px;
  }

  .community-preview {
    align-items: stretch;
    flex-direction: column;

    gap: 24px;

    margin-top: 78px;
  }

  .secondary-button {
    width: 100%;
  }
}


/* =========================
   VERY SMALL MOBILE
========================= */

@media (max-width: 420px) {
  .badge-preview {
    grid-template-columns: 1fr;
  }
}
</style>