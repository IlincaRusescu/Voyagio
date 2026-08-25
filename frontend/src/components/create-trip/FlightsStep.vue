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

const cabinClasses = [
  'Economy',
  'Premium Economy',
  'Business',
  'First',
  'No preference'
]

const stopPreferences = [
  'Direct only',
  'Direct preferred',
  'Max 1 stop',
  'No preference'
]

const departureTimes = [
  'Early morning',
  'Morning',
  'Around noon',
  'Afternoon',
  'Evening',
  'No preference'
]

const luggageOptions = [
  'Personal item only',
  'Cabin luggage',
  'Checked luggage',
  'No preference'
]

const airlinePreferences = [
  'Low-cost is fine',
  'Prefer full-service airlines',
  'No preference'
]

function handleNext() {
  if (props.formData.alreadyHaveFlights) {
    emit('next')
    return
  }

  if (!props.formData.departureLocation.trim()) {
    alert('Please enter your departure city or airport.')
    return
  }

  if (
    props.formData.budget.amount !== '' &&
    props.formData.budget.amount < 0
  ) {
    alert('Please enter a valid flight budget.')
    return
  }

  emit('next')
}
</script>

<template>
  <section>
    <p>Step 4 of 6</p>

    <h1>Let's talk about flights</h1>

    <p>
      Tell us what kind of flight would work best for your trip.
    </p>

    <!-- Already have flights -->
    <div>
      <label>
        <input
          v-model="formData.alreadyHaveFlights"
          type="checkbox"
        >

        I already have my flights
      </label>
    </div>

    <template v-if="!formData.alreadyHaveFlights">

      <!-- Departure -->
      <div>
        <h2>Where are you departing from?</h2>

        <label for="departure-location">
          City or airport
        </label>

        <input
          id="departure-location"
          v-model="formData.departureLocation"
          type="text"
          placeholder="e.g. Bucharest or OTP"
        >
      </div>

      <!-- Budget -->
      <div>
        <h2>Flight budget</h2>

        <p>
          You can leave this empty if you don't have a specific budget.
        </p>

        <div>
          <label for="flight-budget">
            Amount
          </label>

          <input
            id="flight-budget"
            v-model.number="formData.budget.amount"
            type="number"
            min="0"
            placeholder="e.g. 250"
          >
        </div>

        <div>
          <label for="flight-currency">
            Currency
          </label>

          <select
            id="flight-currency"
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
              name="flight-budget-type"
              value="Per person"
            >

            Per person
          </label>

          <label>
            <input
              v-model="formData.budget.type"
              type="radio"
              name="flight-budget-type"
              value="Total"
            >

            Total
          </label>
        </div>
      </div>

      <!-- Cabin -->
      <div>
        <h2>Which cabin class do you prefer?</h2>

        <label
          v-for="cabin in cabinClasses"
          :key="cabin"
        >
          <input
            v-model="formData.cabinClass"
            type="radio"
            name="cabin-class"
            :value="cabin"
          >

          {{ cabin }}
        </label>
      </div>

      <!-- Stops -->
      <div>
        <h2>How do you feel about connections?</h2>

        <label
          v-for="preference in stopPreferences"
          :key="preference"
        >
          <input
            v-model="formData.stops"
            type="radio"
            name="flight-stops"
            :value="preference"
          >

          {{ preference }}
        </label>
      </div>

      <!-- Departure time -->
      <div>
        <h2>When would you prefer to depart?</h2>

        <label
          v-for="time in departureTimes"
          :key="time"
        >
          <input
            v-model="formData.preferredDepartureTime"
            type="radio"
            name="departure-time"
            :value="time"
          >

          {{ time }}
        </label>
      </div>

      <!-- Luggage -->
      <div>
        <h2>What luggage do you need?</h2>

        <label
          v-for="luggage in luggageOptions"
          :key="luggage"
        >
          <input
            v-model="formData.luggage"
            type="radio"
            name="luggage"
            :value="luggage"
          >

          {{ luggage }}
        </label>
      </div>

      <!-- Airline preference -->
      <div>
        <h2>Any airline preference?</h2>

        <label
          v-for="preference in airlinePreferences"
          :key="preference"
        >
          <input
            v-model="formData.airlinePreference"
            type="radio"
            name="airline-preference"
            :value="preference"
          >

          {{ preference }}
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