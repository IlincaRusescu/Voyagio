<script setup>
import { reactive, ref } from 'vue'

import TripBasicsStep from '../components/create-trip/TripBasicsStep.vue'
import InterestsStep from '../components/create-trip/InterestsStep.vue'
import StayStep from '../components/create-trip/StayStep.vue'
import FlightsStep from '../components/create-trip/FlightsStep.vue'
import BudgetStep from '../components/create-trip/BudgetStep.vue'
import FinalDetailsStep from '../components/create-trip/FinalDetailsStep.vue'

const currentStep = ref(1)

const tripForm = reactive({
  basics: {
    destination: {
      city: '',
      country: '',
      countryCode: ''
    },

    startDate: '',
    endDate: '',
    travelingWith: '',
    numberOfTravelers: 1,
    childrenAges: '',
    pace: '',
    interests: []
  },

  interestPreferences: {
    food: {
      cuisines: [],
      places: [],
      spending: ''
    },

    nightlife: {
      types: [],
      music: []
    },

    culture: {
      types: [],
      amount: ''
    },

    nature: {
      types: [],
      hikingDifficulty: ''
    },

    beaches: {
      types: [],
      time: ''
    },

    relaxation: {
      types: [],
      downtime: ''
    },

    shopping: {
      types: []
    },

    adventure: {
      types: [],
      intensity: ''
    },

    entertainment: {
      types: []
    },

    photography: {
      types: []
    },

    topPriorities: []
  },

  accommodation: {
    skipRecommendations: false,

    budget: {
      amount: '',
      currency: 'EUR',
      type: 'Per night'
    },

    level: 'No preference',
    types: [],
    roomPreference: 'No preference',
    amenities: [],
    areaPreference: 'No preference'
  },

  flights: {
    alreadyHaveFlights: false,

    tripType: 'Round trip',

    departureLocation: '',

    budget: {
      amount: '',
      currency: 'EUR',
      type: 'Per person'
    },

    cabinClass: 'Economy',
    stops: 'No preference',
    preferredDepartureTime: 'No preference',
    luggage: 'No preference',
    airlinePreference: 'No preference',

    selectedFlight: null
  },

  budgetAndStyle: {
    spendingBudget: {
      amount: '',
      currency: 'EUR',
      type: 'Per person'
    },

    experienceStyle: '',
    dayStartPreference: ''
  },

  finalDetails: {
    thingsToAvoid: '',
    thingsToKnow: '',
    specialRequests: ''
  }
})

function nextStep() {
  if (
    currentStep.value === 1 &&
    tripForm.basics.interests.length <= 3
  ) {
    tripForm.interestPreferences.topPriorities = [
      ...tripForm.basics.interests
    ]
  }

  if (currentStep.value < 6) {
    currentStep.value++
  }
}

function previousStep() {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

function generateItinerary() {
  console.log('Complete Voyagio trip form:', tripForm)

  alert(
    'Your trip form is complete! OpenAI generation will be connected next.'
  )
}
</script>

<template>
  <main class="create-trip-page">
    <div class="create-trip-container">

      <!-- PAGE HEADER -->
      <header class="create-trip-header">
        <div class="header-copy">
          <p class="eyebrow">
            BUILD YOUR TRIP
          </p>

          <h1>
            Plan your next adventure
          </h1>

          <p class="header-description">
            Tell us how you like to travel and Voyagio will build the trip around you.
          </p>
        </div>

        <div class="step-counter">
          Step {{ currentStep }} of 6
        </div>
      </header>


      <!-- PROGRESS -->
      <section class="progress-wrapper">
        <div class="progress-track">
          <div
            class="progress-fill"
            :style="{ width: `${(currentStep / 6) * 100}%` }"
          />
        </div>

        <div class="progress-labels">
          <span :class="{ active: currentStep >= 1 }">
            Basics
          </span>

          <span :class="{ active: currentStep >= 2 }">
            Interests
          </span>

          <span :class="{ active: currentStep >= 3 }">
            Stay
          </span>

          <span :class="{ active: currentStep >= 4 }">
            Flights
          </span>

          <span :class="{ active: currentStep >= 5 }">
            Budget
          </span>

          <span :class="{ active: currentStep >= 6 }">
            Final details
          </span>
        </div>
      </section>


      <!-- STEP CONTENT -->
      <section class="step-shell">
        <TripBasicsStep
          v-if="currentStep === 1"
          :form-data="tripForm.basics"
          @next="nextStep"
        />

        <InterestsStep
          v-else-if="currentStep === 2"
          :selected-interests="tripForm.basics.interests"
          :form-data="tripForm.interestPreferences"
          @next="nextStep"
          @back="previousStep"
        />

        <StayStep
          v-else-if="currentStep === 3"
          :form-data="tripForm.accommodation"
          @next="nextStep"
          @back="previousStep"
        />

        <FlightsStep
          v-else-if="currentStep === 4"
          :form-data="tripForm.flights"
          @next="nextStep"
          @back="previousStep"
        />

        <BudgetStep
          v-else-if="currentStep === 5"
          :form-data="tripForm.budgetAndStyle"
          @next="nextStep"
          @back="previousStep"
        />

        <FinalDetailsStep
          v-else-if="currentStep === 6"
          :form-data="tripForm.finalDetails"
          :trip-form="tripForm"
          @back="previousStep"
          @generate="generateItinerary"
        />
      </section>

    </div>
  </main>
</template>

<style scoped>
.create-trip-page {
  min-height: calc(100vh - 88px);

  background: var(--color-background);
  color: var(--color-text);
}

.create-trip-container {
  width: min(100% - 48px, 1180px);

  margin: 0 auto;

  padding: 64px 0 88px;
}


/* =========================
   HEADER
========================= */

.create-trip-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  gap: 32px;
}

.header-copy {
  max-width: 760px;
}

.eyebrow {
  margin: 0 0 14px;

  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.16em;

  color: var(--color-accent);
}

.create-trip-header h1 {
  margin: 0;

  font-family: var(--font-heading);
  font-size: clamp(40px, 5vw, 58px);
  font-weight: 600;

  line-height: 1.05;

  color: var(--color-text);
}

.header-description {
  max-width: 620px;

  margin: 18px 0 0;

  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.65;

  color: #6c7567;
}

.step-counter {
  flex-shrink: 0;

  padding: 10px 14px;

  border: 1px solid rgba(84, 107, 65, 0.16);
  border-radius: var(--border-radius-small);

  background: rgba(255, 255, 255, 0.34);

  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 700;

  color: var(--color-primary);
}


/* =========================
   PROGRESS
========================= */

.progress-wrapper {
  margin-top: 42px;
}

.progress-track {
  width: 100%;
  height: 6px;

  overflow: hidden;

  border-radius: 999px;

  background: rgba(84, 107, 65, 0.12);
}

.progress-fill {
  height: 100%;

  border-radius: inherit;

  background: var(--color-primary);

  transition: width 0.3s ease;
}

.progress-labels {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));

  gap: 10px;

  margin-top: 12px;
}

.progress-labels span {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 500;

  color: #9aa094;

  text-align: center;

  transition: color 0.2s ease;
}

.progress-labels span:first-child {
  text-align: left;
}

.progress-labels span:last-child {
  text-align: right;
}

.progress-labels span.active {
  color: var(--color-primary);
}


/* =========================
   STEP SHELL
========================= */

.step-shell {
  margin-top: 46px;

  padding: 38px;

  border: 1px solid rgba(84, 107, 65, 0.12);
  border-radius: var(--border-radius-medium);

  background: rgba(255, 255, 255, 0.28);
}


/* =========================
   TABLET
========================= */

@media (max-width: 900px) {
  .create-trip-container {
    padding-top: 48px;
  }

  .create-trip-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .progress-labels {
    display: none;
  }

  .progress-wrapper {
    margin-top: 30px;
  }
}


/* =========================
   MOBILE
========================= */

@media (max-width: 600px) {
  .create-trip-page {
    min-height: calc(100vh - 72px);
  }

  .create-trip-container {
    width: calc(100% - 32px);

    padding: 36px 0 60px;
  }

  .create-trip-header h1 {
    font-size: 40px;
  }

  .header-description {
    font-size: 15px;
  }

  .step-shell {
    margin-top: 32px;

    padding: 22px 18px;

    border-radius: var(--border-radius-medium);
  }

  .step-counter {
    padding: 8px 12px;
  }
}
</style>