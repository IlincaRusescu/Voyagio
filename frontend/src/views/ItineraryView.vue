<script setup>
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const itinerary = ref(null)
const currentSection = ref(0)

/*
  Citim itinerariul generat temporar din browser.
*/
const storedItinerary =
  sessionStorage.getItem('generatedItinerary')

if (storedItinerary) {
  try {
    itinerary.value = JSON.parse(storedItinerary)
  } catch (error) {
    console.error(
      'Could not read generated itinerary:',
      error
    )
  }
}

/*
  Construim automat paginile itinerariului.

  Exemplu:
  Overview
  Stays
  Day 1
  Day 2
  ...
  Restaurants
  Before You Go
*/
const sections = computed(() => {
  if (!itinerary.value) {
    return []
  }

  const result = [
    {
      type: 'overview',
      label: 'Overview'
    }
  ]

  if (itinerary.value.stays?.length) {
    result.push({
      type: 'stays',
      label: 'Top 3 Stays'
    })
  }

  for (const day of itinerary.value.days || []) {
    result.push({
      type: 'day',
      label: `Day ${day.dayNumber}`,
      day
    })
  }

  if (itinerary.value.restaurants?.length) {
    result.push({
      type: 'restaurants',
      label: 'Restaurants'
    })
  }

  if (itinerary.value.beforeYouGo) {
    result.push({
      type: 'beforeYouGo',
      label: 'Before You Go'
    })
  }

  return result
})

const activeSection = computed(() => {
  return sections.value[currentSection.value]
})

const previousSection = computed(() => {
  if (currentSection.value === 0) {
    return null
  }

  return sections.value[currentSection.value - 1]
})

const nextSection = computed(() => {
  if (
    currentSection.value >=
    sections.value.length - 1
  ) {
    return null
  }

  return sections.value[currentSection.value + 1]
})

function goNext() {
  if (
    currentSection.value <
    sections.value.length - 1
  ) {
    currentSection.value++
  }
}

function goBack() {
  if (currentSection.value > 0) {
    currentSection.value--
  }
}

function goToSection(index) {
  currentSection.value = index
}

function goCreateTrip() {
  router.push('/create-trip')
}

/*
  Când schimbăm pagina itinerariului,
  urcăm automat sus.
*/
watch(currentSection, () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
})

function formatDuration(duration) {
  if (!duration) {
    return ''
  }

  const min = duration.minMinutes
  const max = duration.maxMinutes

  if (min && max) {
    if (min === max) {
      return `${min} min`
    }

    return `${min}–${max} min`
  }

  if (min) {
    return `${min}+ min`
  }

  if (max) {
    return `Up to ${max} min`
  }

  return ''
}

function formatTimeOfDay(value) {
  if (!value) {
    return ''
  }

  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  )
}
</script>

<template>
  <main class="itinerary-page">

    <!-- NO ITINERARY -->
    <section
      v-if="!itinerary"
      class="empty-state"
    >
      <p class="eyebrow">
        YOUR ITINERARY
      </p>

      <h1>No itinerary found</h1>

      <p>
        Generate a trip first and it will appear here.
      </p>

      <button
        class="btn-primary"
        @click="goCreateTrip"
      >
        Plan a trip
      </button>
    </section>


    <!-- ITINERARY -->
    <template v-else>

      <!-- TOP HEADER -->
      <header class="itinerary-topbar">
        <div>
          <p class="eyebrow">
            YOUR VOYAGIO ITINERARY
          </p>

          <p class="destination-title">
            {{ itinerary.overview?.title }}
          </p>
        </div>

        <div class="section-position">
          {{ currentSection + 1 }}
          /
          {{ sections.length }}
        </div>
      </header>


      <!-- SECTION NAVIGATION -->
      <nav class="section-tabs">
        <button
          v-for="(section, index) in sections"
          :key="`${section.type}-${index}`"
          class="section-tab"
          :class="{
            active: currentSection === index
          }"
          @click="goToSection(index)"
        >
          {{ section.label }}
        </button>
      </nav>


      <!-- =========================
           OVERVIEW
      ========================== -->
      <section
        v-if="activeSection?.type === 'overview'"
        class="itinerary-section overview-section"
      >
        <div class="overview-copy">
          <p class="section-kicker">
            TRIP OVERVIEW
          </p>

          <h1>
            {{ itinerary.overview?.title }}
          </h1>

          <p
            v-if="itinerary.overview?.subtitle"
            class="overview-subtitle"
          >
            {{ itinerary.overview.subtitle }}
          </p>

          <p
            v-if="itinerary.overview?.summary"
            class="overview-summary"
          >
            {{ itinerary.overview.summary }}
          </p>
        </div>

        <div
          v-if="itinerary.overview?.highlights?.length"
          class="highlights-card"
        >
          <p class="card-label">
            TRIP HIGHLIGHTS
          </p>

          <ul>
            <li
              v-for="highlight in itinerary.overview.highlights"
              :key="highlight"
            >
              {{ highlight }}
            </li>
          </ul>
        </div>
      </section>


      <!-- =========================
           STAYS
      ========================== -->
      <section
        v-else-if="activeSection?.type === 'stays'"
        class="itinerary-section"
      >
        <div class="section-heading-block">
          <p class="section-kicker">
            WHERE TO STAY
          </p>

          <h1>Top 3 stays for your trip</h1>

          <p>
            Selected to match your travel style,
            location preferences and budget.
          </p>
        </div>

        <div class="stay-grid">
          <article
            v-for="(stay, index) in itinerary.stays"
            :key="stay.place?.placeId || stay.name"
            class="stay-card"
          >
            <div class="card-number">
              0{{ index + 1 }}
            </div>

            <div>
              <p
                v-if="stay.matchType"
                class="match-type"
              >
                {{ stay.matchType }}
              </p>

              <h2>
                {{ stay.name }}
              </h2>

              <p class="card-description">
                {{ stay.whyRecommended }}
              </p>

              <div
                v-if="stay.place?.address"
                class="place-address"
              >
                {{ stay.place.address }}
              </div>
            </div>
          </article>
        </div>
      </section>


      <!-- =========================
           DAY
      ========================== -->
      <section
        v-else-if="activeSection?.type === 'day'"
        class="itinerary-section day-section"
      >
        <header class="day-header">
          <div>
            <p class="section-kicker">
              DAY {{ activeSection.day.dayNumber }}
              · {{ activeSection.day.date }}
            </p>

            <h1>
              {{ activeSection.day.title }}
            </h1>

            <p
              v-if="activeSection.day.theme"
              class="day-theme"
            >
              {{ activeSection.day.theme }}
            </p>
          </div>

          <div class="day-tags">
            <span
              v-if="activeSection.day.isArrivalDay"
            >
              Arrival day
            </span>

            <span
              v-if="activeSection.day.isDepartureDay"
            >
              Departure day
            </span>
          </div>
        </header>

        <div class="activities-list">
          <template
            v-for="(activity, index) in activeSection.day.activities"
            :key="activity.activityId"
          >

            <!-- ACTIVITY -->
            <article class="activity-card">
              <div class="activity-meta">
                <span class="time-of-day">
                  {{
                    formatTimeOfDay(
                      activity.timeOfDay
                    )
                  }}
                </span>

                <span
                  v-if="formatDuration(activity.duration)"
                  class="duration"
                >
                  {{
                    formatDuration(
                      activity.duration
                    )
                  }}
                </span>
              </div>

              <h2>
                {{ activity.name }}
              </h2>

              <p
                v-if="activity.category"
                class="activity-category"
              >
                {{ activity.category }}
              </p>

              <p
                v-if="activity.whyRecommended"
                class="activity-description"
              >
                {{ activity.whyRecommended }}
              </p>

              <div
                v-if="activity.place?.address"
                class="activity-location"
              >
                <strong>Location</strong>

                <span>
                  {{ activity.place.address }}
                </span>
              </div>

              <div
                v-if="activity.notes"
                class="activity-note"
              >
                {{ activity.notes }}
              </div>
            </article>


            <!-- ROUTE TO NEXT -->
            <div
              v-if="
                activity.routeToNext &&
                index <
                  activeSection.day.activities.length - 1
              "
              class="route-between"
            >
              <div class="route-line"></div>

              <div class="route-content">
                <p>
                  To
                  <strong>
                    {{
                      activity.routeToNext
                        .destinationName
                    }}
                  </strong>
                </p>

                <div class="route-options">
                  <span
                    v-if="
                      activity.routeToNext.walking
                    "
                  >
                    Walk
                    {{
                      activity.routeToNext
                        .walking.duration
                    }}
                    ·
                    {{
                      activity.routeToNext
                        .walking.distance
                    }}
                  </span>

                  <span
                    v-if="
                      activity.routeToNext.transit
                    "
                  >
                    Transit
                    {{
                      activity.routeToNext
                        .transit.duration
                    }}
                    ·
                    {{
                      activity.routeToNext
                        .transit.distance
                    }}
                  </span>

                  <span
                    v-if="
                      activity.routeToNext.driving
                    "
                  >
                    Drive
                    {{
                      activity.routeToNext
                        .driving.duration
                    }}
                    ·
                    {{
                      activity.routeToNext
                        .driving.distance
                    }}
                  </span>
                </div>
              </div>
            </div>

          </template>
        </div>
      </section>


      <!-- =========================
           RESTAURANTS
      ========================== -->
      <section
        v-else-if="
          activeSection?.type === 'restaurants'
        "
        class="itinerary-section"
      >
        <div class="section-heading-block">
          <p class="section-kicker">
            EAT & DRINK
          </p>

          <h1>Restaurants worth saving</h1>

          <p>
            A separate shortlist so your daily
            itinerary stays flexible.
          </p>
        </div>

        <div class="restaurant-grid">
          <article
            v-for="restaurant in itinerary.restaurants"
            :key="
              restaurant.place?.placeId ||
              restaurant.name
            "
            class="restaurant-card"
          >
            <div class="restaurant-top">
              <div>
                <p
                  v-if="
                    restaurant.recommendationType
                  "
                  class="match-type"
                >
                  {{
                    restaurant.recommendationType
                  }}
                </p>

                <h2>
                  {{ restaurant.name }}
                </h2>
              </div>

              <span
                v-if="restaurant.cuisine"
                class="cuisine-tag"
              >
                {{ restaurant.cuisine }}
              </span>
            </div>

            <p class="card-description">
              {{ restaurant.whyRecommended }}
            </p>

            <div
              v-if="restaurant.place?.address"
              class="place-address"
            >
              {{ restaurant.place.address }}
            </div>

            <p
              v-if="
                restaurant.reservationRecommended
              "
              class="reservation-note"
            >
              Reservation recommended
            </p>
          </article>
        </div>
      </section>


      <!-- =========================
           BEFORE YOU GO
      ========================== -->
      <section
        v-else-if="
          activeSection?.type === 'beforeYouGo'
        "
        class="itinerary-section"
      >
        <div class="section-heading-block">
          <p class="section-kicker">
            BEFORE YOU GO
          </p>

          <h1>A few useful things to know</h1>
        </div>

        <div class="tips-grid">

          <article
            v-if="
              itinerary.beforeYouGo?.bookAhead?.length
            "
            class="tips-card"
          >
            <p class="tips-number">
              01
            </p>

            <h2>Book ahead</h2>

            <ul>
              <li
                v-for="tip in itinerary.beforeYouGo.bookAhead"
                :key="tip"
              >
                {{ tip }}
              </li>
            </ul>
          </article>


          <article
            v-if="
              itinerary.beforeYouGo
                ?.gettingAround?.length
            "
            class="tips-card"
          >
            <p class="tips-number">
              02
            </p>

            <h2>Getting around</h2>

            <ul>
              <li
                v-for="tip in itinerary.beforeYouGo.gettingAround"
                :key="tip"
              >
                {{ tip }}
              </li>
            </ul>
          </article>


          <article
            v-if="
              itinerary.beforeYouGo?.localTips?.length
            "
            class="tips-card"
          >
            <p class="tips-number">
              03
            </p>

            <h2>Local tips</h2>

            <ul>
              <li
                v-for="tip in itinerary.beforeYouGo.localTips"
                :key="tip"
              >
                {{ tip }}
              </li>
            </ul>
          </article>


          <article
            v-if="
              itinerary.beforeYouGo
                ?.packingTips?.length
            "
            class="tips-card"
          >
            <p class="tips-number">
              04
            </p>

            <h2>Packing</h2>

            <ul>
              <li
                v-for="tip in itinerary.beforeYouGo.packingTips"
                :key="tip"
              >
                {{ tip }}
              </li>
            </ul>
          </article>

        </div>
      </section>


      <!-- BOTTOM NAVIGATION -->
      <footer class="itinerary-navigation">
        <div>
          <button
            v-if="previousSection"
            class="btn-secondary"
            @click="goBack"
          >
            Back: {{ previousSection.label }}
          </button>
        </div>

        <button
          v-if="nextSection"
          class="btn-primary"
          @click="goNext"
        >
          Next: {{ nextSection.label }}
        </button>

        <button
          v-else
          class="btn-primary"
          disabled
        >
          End of itinerary
        </button>
      </footer>

    </template>
  </main>
</template>

<style scoped>
.itinerary-page {
  min-height: calc(100vh - 88px);
  padding: 48px 0 88px;

  background: var(--color-background);
  color: var(--color-text);
}

.itinerary-topbar,
.section-tabs,
.itinerary-section,
.itinerary-navigation {
  width: min(100% - 48px, 1180px);
  margin-left: auto;
  margin-right: auto;
}

.eyebrow,
.section-kicker,
.card-label {
  margin: 0;

  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.16em;

  color: var(--color-accent);
}

.itinerary-topbar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  gap: 24px;
}

.destination-title {
  max-width: 760px;

  margin: 8px 0 0;

  font-family: var(--font-heading);
  font-size: 24px;
  font-weight: 600;

  line-height: 1.25;
}

.section-position {
  flex-shrink: 0;

  font-size: 13px;
  font-weight: 700;

  color: var(--color-primary);
}


/* =========================
   SECTION TABS
========================= */

.section-tabs {
  display: flex;

  gap: 8px;

  margin-top: 28px;
  padding-bottom: 10px;

  overflow-x: auto;
}

.section-tab {
  flex-shrink: 0;

  padding: 8px 13px;

  border: 1px solid rgba(84, 107, 65, 0.15);
  border-radius: 999px;

  background: transparent;

  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 600;

  color: #7c8377;

  cursor: pointer;
}

.section-tab.active {
  border-color: var(--color-primary);

  background: var(--color-primary);

  color: var(--color-background);
}


/* =========================
   MAIN SECTION
========================= */

.itinerary-section {
  margin-top: 42px;

  padding: 44px;

  border: 1px solid rgba(84, 107, 65, 0.12);
  border-radius: var(--border-radius-medium);

  background: rgba(255, 255, 255, 0.28);
}

.itinerary-section h1 {
  margin: 10px 0 0;

  font-family: var(--font-heading);
  font-size: clamp(38px, 5vw, 58px);
  font-weight: 600;

  line-height: 1.06;
}

.section-heading-block {
  max-width: 760px;

  margin-bottom: 36px;
}

.section-heading-block > p:last-child {
  margin-top: 14px;

  color: #6c7567;
}


/* =========================
   OVERVIEW
========================= */

.overview-section {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(300px, 0.7fr);

  gap: 48px;
}

.overview-subtitle {
  margin: 18px 0 0;

  font-family: var(--font-heading);
  font-size: 22px;

  line-height: 1.45;

  color: var(--color-primary);
}

.overview-summary {
  margin: 24px 0 0;

  font-size: 16px;
  line-height: 1.8;

  color: #626b5e;
}

.highlights-card {
  align-self: start;

  padding: 28px;

  border-radius: var(--border-radius-medium);

  background: var(--color-primary);

  color: var(--color-background);
}

.highlights-card .card-label {
  color: var(--color-sand);
}

.highlights-card ul {
  display: grid;

  gap: 16px;

  margin: 22px 0 0;
  padding-left: 20px;
}

.highlights-card li {
  line-height: 1.55;
}


/* =========================
   STAYS
========================= */

.stay-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  gap: 18px;
}

.stay-card,
.restaurant-card,
.activity-card,
.tips-card {
  border: 1px solid rgba(84, 107, 65, 0.12);
  border-radius: var(--border-radius-medium);

  background: rgba(255, 248, 236, 0.72);
}

.stay-card {
  padding: 26px;
}

.card-number,
.tips-number {
  margin-bottom: 36px;

  font-family: var(--font-heading);
  font-size: 28px;

  color: var(--color-accent);
}

.match-type {
  margin: 0 0 8px;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.1em;
  text-transform: uppercase;

  color: var(--color-primary);
}

.stay-card h2,
.restaurant-card h2,
.activity-card h2,
.tips-card h2 {
  margin: 0;

  font-family: var(--font-heading);
  font-size: 26px;
  font-weight: 600;

  line-height: 1.2;
}

.card-description {
  margin: 16px 0 0;

  line-height: 1.65;

  color: #626b5e;
}

.place-address {
  margin-top: 20px;

  font-size: 13px;
  line-height: 1.5;

  color: #838a7e;
}


/* =========================
   DAYS
========================= */

.day-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 32px;

  margin-bottom: 38px;
}

.day-theme {
  margin: 16px 0 0;

  font-size: 16px;

  color: #6c7567;
}

.day-tags {
  display: flex;

  gap: 8px;

  flex-wrap: wrap;
}

.day-tags span {
  padding: 8px 12px;

  border-radius: 999px;

  background: var(--color-sand);

  font-size: 12px;
  font-weight: 700;

  color: var(--color-primary);
}

.activities-list {
  max-width: 820px;

  margin: 0 auto;
}

.activity-card {
  padding: 30px;
}

.activity-meta {
  display: flex;
  align-items: center;

  gap: 12px;

  margin-bottom: 12px;
}

.time-of-day {
  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.1em;
  text-transform: uppercase;

  color: var(--color-accent);
}

.duration {
  padding-left: 12px;

  border-left: 1px solid rgba(84, 107, 65, 0.18);

  font-size: 12px;

  color: #7c8377;
}

.activity-category {
  margin: 8px 0 0;

  font-size: 12px;

  text-transform: capitalize;

  color: var(--color-primary);
}

.activity-description {
  margin: 18px 0 0;

  line-height: 1.7;

  color: #626b5e;
}

.activity-location {
  display: grid;

  gap: 4px;

  margin-top: 22px;

  font-size: 13px;

  color: #777f72;
}

.activity-note {
  margin-top: 20px;
  padding: 16px 18px;

  border-radius: var(--border-radius-small);

  background: rgba(220, 204, 172, 0.35);

  font-size: 13px;
  line-height: 1.6;

  color: #596053;
}


/* ROUTES */

.route-between {
  display: grid;
  grid-template-columns: 2px 1fr;

  gap: 20px;

  min-height: 100px;

  margin-left: 28px;
}

.route-line {
  width: 2px;

  background: rgba(84, 107, 65, 0.22);
}

.route-content {
  align-self: center;

  padding: 16px 0;
}

.route-content p {
  margin: 0 0 10px;

  font-size: 13px;

  color: #727a6e;
}

.route-options {
  display: flex;

  gap: 8px;

  flex-wrap: wrap;
}

.route-options span {
  padding: 7px 10px;

  border-radius: 999px;

  background: rgba(84, 107, 65, 0.08);

  font-size: 11px;
  font-weight: 600;

  color: var(--color-primary);
}


/* =========================
   RESTAURANTS
========================= */

.restaurant-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 18px;
}

.restaurant-card {
  padding: 26px;
}

.restaurant-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 20px;
}

.cuisine-tag {
  flex-shrink: 0;

  padding: 7px 10px;

  border-radius: 999px;

  background: var(--color-sand);

  font-size: 11px;
  font-weight: 700;

  color: var(--color-primary);
}

.reservation-note {
  margin: 16px 0 0;

  font-size: 12px;
  font-weight: 700;

  color: var(--color-accent);
}


/* =========================
   BEFORE YOU GO
========================= */

.tips-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 18px;
}

.tips-card {
  padding: 28px;
}

.tips-card ul {
  display: grid;

  gap: 14px;

  margin: 22px 0 0;
  padding-left: 20px;
}

.tips-card li {
  line-height: 1.6;

  color: #626b5e;
}


/* =========================
   NAVIGATION
========================= */

.itinerary-navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;

  margin-top: 26px;
}

.itinerary-navigation button:disabled {
  cursor: default;

  opacity: 0.45;
}


/* =========================
   EMPTY STATE
========================= */

.empty-state {
  width: min(100% - 48px, 700px);

  margin: 80px auto;

  text-align: center;
}

.empty-state h1 {
  margin: 10px 0;

  font-family: var(--font-heading);
  font-size: 48px;
}

.empty-state > p:not(.eyebrow) {
  margin-bottom: 28px;

  color: #6c7567;
}


/* =========================
   TABLET
========================= */

@media (max-width: 900px) {
  .overview-section {
    grid-template-columns: 1fr;
  }

  .stay-grid {
    grid-template-columns: 1fr;
  }

  .restaurant-grid,
  .tips-grid {
    grid-template-columns: 1fr;
  }

  .day-header {
    flex-direction: column;
  }
}


/* =========================
   MOBILE
========================= */

@media (max-width: 600px) {
  .itinerary-page {
    padding-top: 32px;
  }

  .itinerary-topbar,
  .section-tabs,
  .itinerary-section,
  .itinerary-navigation {
    width: calc(100% - 32px);
  }

  .destination-title {
    font-size: 19px;
  }

  .itinerary-section {
    margin-top: 28px;

    padding: 24px 18px;
  }

  .itinerary-section h1 {
    font-size: 38px;
  }

  .overview-subtitle {
    font-size: 19px;
  }

  .activity-card,
  .stay-card,
  .restaurant-card,
  .tips-card {
    padding: 22px;
  }

  .restaurant-top {
    flex-direction: column;
  }

  .itinerary-navigation {
    align-items: stretch;
    flex-direction: column-reverse;
  }

  .itinerary-navigation > div,
  .itinerary-navigation button {
    width: 100%;
  }
}
</style>