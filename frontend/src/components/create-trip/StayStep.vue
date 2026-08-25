<script setup>
const props = defineProps({
  formData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['next', 'back'])

const currencies = [
  'EUR',
  'USD',
  'GBP',
  'RON'
]

const accommodationLevels = [
  'No preference',
  'Budget',
  'Mid-range',
  'Upscale',
  'Luxury'
]

const accommodationTypes = [
  'Hotel',
  'Boutique hotel',
  'Apartment',
  'Hostel',
  'Resort',
  'No preference'
]

const roomPreferences = [
  'Single room',
  'Double room',
  'Twin room',
  'Triple room',
  'Family room',
  'Suite',
  'Apartment / entire place',
  'No preference'
]

const amenities = [
  'Breakfast included',
  'Central location',
  'Near public transport',
  'Quiet area',
  'Close to nightlife',
  'Pool',
  'Spa',
  'Gym',
  'Parking',
  'Great / scenic view',
  'Adults-only',
  'Family-friendly'
]

const areaPreferences = [
  'Central & lively',
  'Quiet',
  'No preference'
]

function toggleArrayValue(array, value) {
  const index = array.indexOf(value)

  if (index === -1) {
    array.push(value)
  } else {
    array.splice(index, 1)
  }
}

function handleNext() {
  if (props.formData.skipRecommendations) {
    emit('next')
    return
  }

  if (
    props.formData.budget.amount !== '' &&
    props.formData.budget.amount < 0
  ) {
    alert('Please enter a valid accommodation budget.')
    return
  }

  emit('next')
}
</script>

<template>
  <section>
    <p>Step 3 of 6</p>

    <h1>Where would you like to stay?</h1>

    <p>
      Tell us what kind of accommodation would suit your trip.
    </p>

    <!-- Skip accommodation -->
    <div>
      <label>
        <input
          v-model="formData.skipRecommendations"
          type="checkbox"
        >

        I already have accommodation / I don't need accommodation recommendations
      </label>
    </div>

    <template v-if="!formData.skipRecommendations">

      <!-- Budget -->
      <div>
        <h2>Accommodation budget</h2>

        <p>
          This budget is for the accommodation as a whole, not per person.
        </p>

        <p>
          You can leave this empty if you don't have a specific budget.
        </p>

        <div>
          <label for="accommodation-budget">
            Amount
          </label>

          <input
            id="accommodation-budget"
            v-model.number="formData.budget.amount"
            type="number"
            min="0"
            placeholder="e.g. 150"
          >
        </div>

        <div>
          <label for="accommodation-currency">
            Currency
          </label>

          <select
            id="accommodation-currency"
            v-model="formData.budget.currency"
          >
            <option
              v-for="currency in currencies"
              :key="currency"
              :value="currency"
            >
              {{ currency }}
            </option>
          </select>
        </div>

        <div>
          <label>
            <input
              v-model="formData.budget.type"
              type="radio"
              name="accommodation-budget-type"
              value="Per night"
            >

            Per night
          </label>

          <label>
            <input
              v-model="formData.budget.type"
              type="radio"
              name="accommodation-budget-type"
              value="Total trip"
            >

            Total trip
          </label>
        </div>
      </div>

      <!-- Accommodation level -->
      <div>
        <h2>What level of accommodation do you prefer?</h2>

        <label
          v-for="level in accommodationLevels"
          :key="level"
        >
          <input
            v-model="formData.level"
            type="radio"
            name="accommodation-level"
            :value="level"
          >

          {{ level }}
        </label>
      </div>

      <!-- Accommodation type -->
      <div>
        <h2>What type of accommodation do you prefer?</h2>

        <p>
          You can choose more than one.
        </p>

        <button
          v-for="type in accommodationTypes"
          :key="type"
          type="button"
          @click="toggleArrayValue(formData.types, type)"
        >
          {{ formData.types.includes(type) ? '✓ ' : '' }}
          {{ type }}
        </button>
      </div>

      <!-- Room preference -->
      <div>
        <h2>What kind of room would you prefer?</h2>

        <label
          v-for="room in roomPreferences"
          :key="room"
        >
          <input
            v-model="formData.roomPreference"
            type="radio"
            name="room-preference"
            :value="room"
          >

          {{ room }}
        </label>
      </div>

      <!-- Amenities -->
      <div>
        <h2>What matters to you?</h2>

        <p>
          Select anything you'd like us to consider.
        </p>

        <button
          v-for="amenity in amenities"
          :key="amenity"
          type="button"
          @click="toggleArrayValue(formData.amenities, amenity)"
        >
          {{ formData.amenities.includes(amenity) ? '✓ ' : '' }}
          {{ amenity }}
        </button>
      </div>

      <!-- Area -->
      <div>
        <h2>What kind of area would you prefer?</h2>

        <label
          v-for="area in areaPreferences"
          :key="area"
        >
          <input
            v-model="formData.areaPreference"
            type="radio"
            name="area-preference"
            :value="area"
          >

          {{ area }}
        </label>
      </div>

    </template>

    <!-- Navigation -->
    <div>
      <button
        type="button"
        @click="emit('back')"
      >
        Back
      </button>

      <button
        type="button"
        @click="handleNext"
      >
        Next
      </button>
    </div>
  </section>
</template>