<script setup>
const props = defineProps({
  formData: {
    type: Object,
    required: true
  },

  tripForm: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['back', 'generate'])

function listOrFallback(items) {
  if (!items || items.length === 0) {
    return 'None selected'
  }

  return items.join(', ')
}

function handleGenerate() {
  emit('generate')
}
</script>

<template>
  <section>
    <p>Step 6 of 6</p>

    <h1>Final touches</h1>

    <p>
      Add anything else that could help us personalize your trip.
    </p>

    <!-- Things to avoid -->
    <div>
      <label for="things-to-avoid">
        <h2>Anything we should avoid?</h2>
      </label>

      <textarea
        id="things-to-avoid"
        v-model="formData.thingsToAvoid"
        rows="4"
        placeholder="e.g. We don't like crowded clubs or seafood."
      />
    </div>

    <!-- Things we should know -->
    <div>
      <label for="things-to-know">
        <h2>Anything we should know?</h2>
      </label>

      <textarea
        id="things-to-know"
        v-model="formData.thingsToKnow"
        rows="4"
        placeholder="e.g. It's our anniversary and we'd like one romantic evening."
      />
    </div>

    <!-- Special requests -->
    <div>
      <label for="special-requests">
        <h2>Any special requests?</h2>
      </label>

      <textarea
        id="special-requests"
        v-model="formData.specialRequests"
        rows="4"
        placeholder="e.g. I'd love to see a football match if there is one during our trip."
      />
    </div>

    <!-- REVIEW -->
    <div>
      <h1>Review your trip</h1>

      <!-- Basics -->
      <div>
        <h2>Trip</h2>

        <p>
          <strong>Destination:</strong>
          {{ tripForm.basics.destination.city }},
          {{ tripForm.basics.destination.country }}
        </p>

        <p>
          <strong>Dates:</strong>
          {{ tripForm.basics.startDate }}
          →
          {{ tripForm.basics.endDate }}
        </p>

        <p>
          <strong>Travelers:</strong>
          {{ tripForm.basics.numberOfTravelers }}
        </p>

        <p>
          <strong>Traveling with:</strong>
          {{ tripForm.basics.travelingWith }}
        </p>

        <p v-if="tripForm.basics.childrenAges">
          <strong>Children ages:</strong>
          {{ tripForm.basics.childrenAges }}
        </p>

        <p>
          <strong>Pace:</strong>
          {{ tripForm.basics.pace }}
        </p>
      </div>

      <!-- Interests -->
      <div>
        <h2>Interests</h2>

        <p>
          <strong>Selected interests:</strong>
          {{ listOrFallback(tripForm.basics.interests) }}
        </p>

        <p>
          <strong>Top priorities:</strong>
          {{ listOrFallback(tripForm.interestPreferences.topPriorities) }}
        </p>
      </div>

      <!-- Accommodation -->
      <div>
        <h2>Stay</h2>

        <p v-if="tripForm.accommodation.skipRecommendations">
          No accommodation recommendations needed.
        </p>

        <template v-else>
          <p>
            <strong>Budget:</strong>

            <span v-if="tripForm.accommodation.budget.amount">
              {{ tripForm.accommodation.budget.amount }}
              {{ tripForm.accommodation.budget.currency }}
              —
              {{ tripForm.accommodation.budget.type }}
            </span>

            <span v-else>
              No specific budget
            </span>
          </p>

          <p>
            <strong>Level:</strong>
            {{ tripForm.accommodation.level }}
          </p>

          <p>
            <strong>Type:</strong>
            {{ listOrFallback(tripForm.accommodation.types) }}
          </p>

          <p>
            <strong>Preferences:</strong>
            {{ listOrFallback(tripForm.accommodation.amenities) }}
          </p>

          <p>
            <strong>Area:</strong>
            {{ tripForm.accommodation.areaPreference }}
          </p>
        </template>
      </div>

      <!-- Flights -->
      <div>
        <h2>Flights</h2>

        <p v-if="tripForm.flights.alreadyHaveFlights">
          Flights already booked.
        </p>

        <template v-else>
          <p>
            <strong>Departure:</strong>
            {{ tripForm.flights.departureLocation }}
          </p>

          <p>
            <strong>Budget:</strong>

            <span v-if="tripForm.flights.budget.amount">
              {{ tripForm.flights.budget.amount }}
              {{ tripForm.flights.budget.currency }}
              —
              {{ tripForm.flights.budget.type }}
            </span>

            <span v-else>
              No specific budget
            </span>
          </p>

          <p>
            <strong>Cabin:</strong>
            {{ tripForm.flights.cabinClass }}
          </p>

          <p>
            <strong>Connections:</strong>
            {{ tripForm.flights.stops }}
          </p>

          <p>
            <strong>Preferred departure:</strong>
            {{ tripForm.flights.preferredDepartureTime }}
          </p>

          <p>
            <strong>Luggage:</strong>
            {{ tripForm.flights.luggage }}
          </p>

          <p>
            <strong>Airline preference:</strong>
            {{ tripForm.flights.airlinePreference }}
          </p>
        </template>
      </div>

      <!-- Spending -->
      <div>
        <h2>Budget & style</h2>

        <p>
          <strong>Spending budget:</strong>

          <span v-if="tripForm.budgetAndStyle.spendingBudget.amount">
            {{ tripForm.budgetAndStyle.spendingBudget.amount }}
            {{ tripForm.budgetAndStyle.spendingBudget.currency }}
            —
            {{ tripForm.budgetAndStyle.spendingBudget.type }}
          </span>

          <span v-else>
            No specific budget
          </span>
        </p>

        <p>
          <strong>Travel style:</strong>
          {{ tripForm.budgetAndStyle.experienceStyle }}
        </p>

        <p>
          <strong>Daily schedule:</strong>
          {{ tripForm.budgetAndStyle.dayStartPreference }}
        </p>
      </div>

      <!-- Final details -->
      <div>
        <h2>Extra details</h2>

        <p>
          <strong>Avoid:</strong>
          {{ formData.thingsToAvoid || 'Nothing specified' }}
        </p>

        <p>
          <strong>Important details:</strong>
          {{ formData.thingsToKnow || 'Nothing specified' }}
        </p>

        <p>
          <strong>Special requests:</strong>
          {{ formData.specialRequests || 'Nothing specified' }}
        </p>
      </div>
    </div>

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
        @click="handleGenerate"
      >
        Generate My Itinerary
      </button>
    </div>
  </section>
</template>