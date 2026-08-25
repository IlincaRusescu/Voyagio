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

  currentStep.value++
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
  <main>
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
  </main>
</template>