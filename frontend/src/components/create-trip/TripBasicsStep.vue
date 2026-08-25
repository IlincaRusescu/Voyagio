<script setup>
import { ref } from 'vue'
import { countries } from '../../data/countries'

const props = defineProps({
  formData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['next'])

const isValidatingDestination = ref(false)
const destinationError = ref('')

const travelCompanions = [
  'Solo',
  'Partner',
  'Friends',
  'Family',
  'With children',
  'Other'
]

const travelPaces = [
  'Relaxed',
  'Balanced',
  'Packed'
]

const interests = [
  'Food',
  'Nightlife',
  'Culture',
  'Nature',
  'Beaches',
  'Relaxation',
  'Shopping',
  'Adventure',
  'Entertainment',
  'Photography'
]

function handleCountryChange() {
  const selectedCountry = countries.find(
    country => country.name === props.formData.destination.country
  )

  props.formData.destination.countryCode =
    selectedCountry?.code || ''
}

function toggleInterest(interest) {
  const index = props.formData.interests.indexOf(interest)

  if (index === -1) {
    props.formData.interests.push(interest)
  } else {
    props.formData.interests.splice(index, 1)
  }
}

async function handleNext() {
  destinationError.value = ''

  // Basic validation
  if (!props.formData.destination.city.trim()) {
    alert('Please enter a destination city.')
    return
  }

  if (!props.formData.destination.country) {
    alert('Please select a country.')
    return
  }

  if (!props.formData.startDate || !props.formData.endDate) {
    alert('Please select your travel dates.')
    return
  }

  if (props.formData.endDate < props.formData.startDate) {
    alert('The end date cannot be before the start date.')
    return
  }

  if (!props.formData.travelingWith) {
    alert('Please tell us who you are traveling with.')
    return
  }

  if (
    !props.formData.numberOfTravelers ||
    props.formData.numberOfTravelers < 1
  ) {
    alert('Please enter a valid number of travelers.')
    return
  }

  if (
    props.formData.travelingWith === 'With children' &&
    !props.formData.childrenAges.trim()
  ) {
    alert('Please enter the ages of the children.')
    return
  }

  if (!props.formData.pace) {
    alert('Please select your travel pace.')
    return
  }

  if (props.formData.interests.length === 0) {
    alert('Please select at least one interest.')
    return
  }

  // Validate destination through our backend
  isValidatingDestination.value = true

  try {
    const response = await fetch(
      'http://localhost:3000/api/locations/validate',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          city: props.formData.destination.city.trim(),
          countryCode: props.formData.destination.countryCode
        })
      }
    )

    if (!response.ok) {
      throw new Error('Could not validate destination')
    }

    const data = await response.json()

    if (!data.valid) {
      destinationError.value =
        'We could not find this city in the selected country. Please check your destination.'

      return
    }

    // Use the destination confirmed by Geoapify
    props.formData.destination.city =
      data.destination.city

    props.formData.destination.country =
      data.destination.country

    props.formData.destination.countryCode =
      data.destination.countryCode

    emit('next')
  } catch (error) {
    console.error(error)

    destinationError.value =
      'We could not validate your destination right now. Please try again.'
  } finally {
    isValidatingDestination.value = false
  }
}
</script>

<template>
  <section>
    <p>Step 1 of 6</p>

    <h1>Tell us about your trip</h1>

    <p>
      Let's start with the basics.
    </p>

    <!-- Destination -->
    <div>
      <h2>Where do you want to go?</h2>

      <div>
        <label for="destination-city">
          City
        </label>

        <input
          id="destination-city"
          v-model="formData.destination.city"
          type="text"
          placeholder="e.g. Barcelona"
        >
      </div>

      <div>
        <label for="destination-country">
          Country
        </label>

        <select
          id="destination-country"
          v-model="formData.destination.country"
          @change="handleCountryChange"
        >
          <option value="">
            Select a country
          </option>

          <option
            v-for="country in countries"
            :key="country.code"
            :value="country.name"
          >
            {{ country.name }}
          </option>
        </select>
      </div>

      <p v-if="destinationError">
        {{ destinationError }}
      </p>
    </div>

    <!-- Dates -->
    <div>
      <h2>When are you going?</h2>

      <div>
        <label for="start-date">
          Start date
        </label>

        <input
          id="start-date"
          v-model="formData.startDate"
          type="date"
        >
      </div>

      <div>
        <label for="end-date">
          End date
        </label>

        <input
          id="end-date"
          v-model="formData.endDate"
          type="date"
        >
      </div>
    </div>

    <!-- Traveling with -->
    <div>
      <h2>Who are you traveling with?</h2>

      <label
        v-for="option in travelCompanions"
        :key="option"
      >
        <input
          v-model="formData.travelingWith"
          type="radio"
          name="traveling-with"
          :value="option"
        >

        {{ option }}
      </label>
    </div>

    <!-- Number of travelers -->
    <div>
      <label for="number-of-travelers">
        Number of travelers
      </label>

      <input
        id="number-of-travelers"
        v-model.number="formData.numberOfTravelers"
        type="number"
        min="1"
      >
    </div>

    <!-- Children -->
    <div v-if="formData.travelingWith === 'With children'">
      <label for="children-ages">
        Ages of children
      </label>

      <input
        id="children-ages"
        v-model="formData.childrenAges"
        type="text"
        placeholder="e.g. 4, 8"
      >

      <p>
        Separate multiple ages with commas.
      </p>
    </div>

    <!-- Travel pace -->
    <div>
      <h2>What's your travel pace?</h2>

      <label
        v-for="pace in travelPaces"
        :key="pace"
      >
        <input
          v-model="formData.pace"
          type="radio"
          name="travel-pace"
          :value="pace"
        >

        {{ pace }}
      </label>
    </div>

    <!-- Interests -->
    <div>
      <h2>What are you interested in?</h2>

      <p>
        Select everything you'd like us to consider.
      </p>

      <button
        v-for="interest in interests"
        :key="interest"
        type="button"
        @click="toggleInterest(interest)"
      >
        {{ formData.interests.includes(interest) ? '✓ ' : '' }}
        {{ interest }}
      </button>
    </div>

    <!-- Next -->
    <div>
      <button
        type="button"
        :disabled="isValidatingDestination"
        @click="handleNext"
      >
        {{
          isValidatingDestination
            ? 'Validating destination...'
            : 'Next'
        }}
      </button>
    </div>
  </section>
</template>