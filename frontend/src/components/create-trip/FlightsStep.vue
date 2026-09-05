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

  if (!props.formData.tripType) {
    alert('Please choose whether you need a round trip or a one-way flight.')
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
  <section class="flights-step">

    <!-- INTRO -->
    <div class="step-intro">
      <p class="step-kicker">
        YOUR FLIGHTS
      </p>

      <h2>
        Let's talk about flights
      </h2>

      <p>
        Tell us what kind of flight would work best for your trip.
        We'll use these preferences when looking for suitable options.
      </p>
    </div>


    <!-- ALREADY HAVE FLIGHTS -->
    <section class="skip-card">
      <label class="skip-option">
        <input
          v-model="formData.alreadyHaveFlights"
          type="checkbox"
        >

        <span class="custom-checkbox">
          <span v-if="formData.alreadyHaveFlights">
            ✓
          </span>
        </span>

        <span class="skip-copy">
          <strong>
            I already have my flights
          </strong>

          <span>
            Skip flight recommendations for this trip.
          </span>
        </span>
      </label>
    </section>


    <template v-if="!formData.alreadyHaveFlights">

      <!-- DEPARTURE -->
      <section class="form-section">
        <div class="section-heading">
          <div class="section-number">
            01
          </div>

          <div>
            <h3>
              Where are you departing from?
            </h3>

            <p>
              Enter your departure city or airport.
            </p>
          </div>
        </div>

        <div class="field-group departure-field">
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
      </section>


      <!-- TRIP TYPE -->
      <section class="form-section">
        <div class="section-heading">
          <div class="section-number">
            02
          </div>

          <div>
            <h3>
              What kind of flight do you need?
            </h3>

            <p>
              Choose whether you're looking for a return flight or a one-way ticket.
            </p>
          </div>
        </div>

        <div class="radio-grid two-options">
          <label
            class="radio-card"
            :class="{ selected: formData.tripType === 'Round trip' }"
          >
            <input
              v-model="formData.tripType"
              type="radio"
              name="flight-trip-type"
              value="Round trip"
            >

            <span>
              Round trip
            </span>
          </label>

          <label
            class="radio-card"
            :class="{ selected: formData.tripType === 'One way' }"
          >
            <input
              v-model="formData.tripType"
              type="radio"
              name="flight-trip-type"
              value="One way"
            >

            <span>
              One way
            </span>
          </label>
        </div>
      </section>


      <!-- BUDGET -->
      <section class="form-section">
        <div class="section-heading">
          <div class="section-number">
            03
          </div>

          <div>
            <h3>
              Flight budget
            </h3>

            <p>
              Leave this empty if you don't have a specific budget in mind.
            </p>
          </div>
        </div>

        <div class="budget-grid">
          <div class="field-group">
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

          <div class="field-group">
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
        </div>

        <div class="preference-group">
          <h4>
            How should we interpret this budget?
          </h4>

          <div class="radio-grid two-options">
            <label
              class="radio-card"
              :class="{ selected: formData.budget.type === 'Per person' }"
            >
              <input
                v-model="formData.budget.type"
                type="radio"
                name="flight-budget-type"
                value="Per person"
              >

              <span>
                Per person
              </span>
            </label>

            <label
              class="radio-card"
              :class="{ selected: formData.budget.type === 'Total' }"
            >
              <input
                v-model="formData.budget.type"
                type="radio"
                name="flight-budget-type"
                value="Total"
              >

              <span>
                Total
              </span>
            </label>
          </div>
        </div>
      </section>


      <!-- CABIN -->
      <section class="form-section">
        <div class="section-heading">
          <div class="section-number">
            04
          </div>

          <div>
            <h3>
              Which cabin class do you prefer?
            </h3>

            <p>
              Choose the travel class you'd be most comfortable with.
            </p>
          </div>
        </div>

        <div class="cabin-grid">
          <label
            v-for="cabin in cabinClasses"
            :key="cabin"
            class="cabin-card"
            :class="{ selected: formData.cabinClass === cabin }"
          >
            <input
              v-model="formData.cabinClass"
              type="radio"
              name="cabin-class"
              :value="cabin"
            >

            <span class="cabin-name">
              {{ cabin }}
            </span>

            <span
              v-if="cabin === 'Economy'"
              class="cabin-description"
            >
              The standard and usually most affordable option.
            </span>

            <span
              v-else-if="cabin === 'Premium Economy'"
              class="cabin-description"
            >
              A little more space and comfort.
            </span>

            <span
              v-else-if="cabin === 'Business'"
              class="cabin-description"
            >
              Extra comfort and premium service.
            </span>

            <span
              v-else-if="cabin === 'First'"
              class="cabin-description"
            >
              Maximum comfort where available.
            </span>

            <span
              v-else
              class="cabin-description"
            >
              Keep suitable options open.
            </span>
          </label>
        </div>
      </section>


      <!-- STOPS -->
      <section class="form-section">
        <div class="section-heading">
          <div class="section-number">
            05
          </div>

          <div>
            <h3>
              How do you feel about connections?
            </h3>

            <p>
              Tell us how much flexibility you have when it comes to stops.
            </p>
          </div>
        </div>

        <div class="radio-grid">
          <label
            v-for="preference in stopPreferences"
            :key="preference"
            class="radio-card"
            :class="{ selected: formData.stops === preference }"
          >
            <input
              v-model="formData.stops"
              type="radio"
              name="flight-stops"
              :value="preference"
            >

            <span>
              {{ preference }}
            </span>
          </label>
        </div>
      </section>


      <!-- DEPARTURE TIME -->
      <section class="form-section">
        <div class="section-heading">
          <div class="section-number">
            06
          </div>

          <div>
            <h3>
              When would you prefer to depart?
            </h3>

            <p>
              Choose the part of the day that works best for you.
            </p>
          </div>
        </div>

        <div class="radio-grid departure-time-grid">
          <label
            v-for="time in departureTimes"
            :key="time"
            class="radio-card"
            :class="{ selected: formData.preferredDepartureTime === time }"
          >
            <input
              v-model="formData.preferredDepartureTime"
              type="radio"
              name="departure-time"
              :value="time"
            >

            <span>
              {{ time }}
            </span>
          </label>
        </div>
      </section>


      <!-- LUGGAGE -->
      <section class="form-section">
        <div class="section-heading">
          <div class="section-number">
            07
          </div>

          <div>
            <h3>
              What luggage do you need?
            </h3>

            <p>
              This helps us compare flight options more realistically.
            </p>
          </div>
        </div>

        <div class="radio-grid">
          <label
            v-for="luggage in luggageOptions"
            :key="luggage"
            class="radio-card"
            :class="{ selected: formData.luggage === luggage }"
          >
            <input
              v-model="formData.luggage"
              type="radio"
              name="luggage"
              :value="luggage"
            >

            <span>
              {{ luggage }}
            </span>
          </label>
        </div>
      </section>


      <!-- AIRLINE -->
      <section class="form-section">
        <div class="section-heading">
          <div class="section-number">
            08
          </div>

          <div>
            <h3>
              Any airline preference?
            </h3>

            <p>
              Let us know whether price or airline type matters to you.
            </p>
          </div>
        </div>

        <div class="radio-grid">
          <label
            v-for="preference in airlinePreferences"
            :key="preference"
            class="radio-card"
            :class="{ selected: formData.airlinePreference === preference }"
          >
            <input
              v-model="formData.airlinePreference"
              type="radio"
              name="airline-preference"
              :value="preference"
            >

            <span>
              {{ preference }}
            </span>
          </label>
        </div>
      </section>

    </template>


    <!-- NAVIGATION -->
    <div class="step-actions">
      <button
        type="button"
        class="back-button"
        @click="emit('back')"
      >
        ← Back
      </button>

      <button
        type="button"
        class="next-button"
        @click="handleNext"
      >
        Next: Budget

        <span aria-hidden="true">
          →
        </span>
      </button>
    </div>

  </section>
</template>

<style scoped>
.flights-step {
  width: 100%;
}


/* =========================
   SKIP CARD
========================= */

.skip-card {
  margin-bottom: 18px;

  padding: 20px;

  border: 1px solid rgba(84, 107, 65, 0.18);
  border-radius: 12px;

  background: rgba(220, 204, 172, 0.3);
}

.skip-option {
  display: flex;
  align-items: flex-start;

  gap: 14px;

  cursor: pointer;
}

.skip-option input {
  position: absolute;

  opacity: 0;

  pointer-events: none;
}

.custom-checkbox {
  width: 22px;
  height: 22px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  margin-top: 1px;

  border: 1px solid rgba(84, 107, 65, 0.42);
  border-radius: 6px;

  background: #fffdf8;

  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 800;

  color: var(--color-background);

  transition:
    background 0.2s ease,
    border-color 0.2s ease;
}

.skip-option input:checked + .custom-checkbox {
  border-color: var(--color-primary);

  background: var(--color-primary);
}

.skip-copy {
  display: flex;
  flex-direction: column;

  gap: 4px;
}

.skip-copy strong {
  font-family: var(--font-body);
  font-size: 14px;

  color: var(--color-text);
}

.skip-copy > span {
  font-family: var(--font-body);
  font-size: 13px;
  line-height: 1.5;

  color: #6c7567;
}


/* =========================
   FORM SECTIONS
========================= */

.form-section {
  padding: 36px 0;

  border-top: 1px solid rgba(84, 107, 65, 0.12);
}


/* =========================
   DEPARTURE
========================= */

.departure-field {
  max-width: 620px;
}


/* =========================
   BUDGET
========================= */

.budget-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 180px;

  gap: 18px;
}

.preference-group {
  margin-top: 24px;
}

.preference-group h4 {
  margin: 0 0 14px;

  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 700;

  color: #3e493b;
}


/* =========================
   RADIO LAYOUTS
========================= */

.radio-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));

  gap: 10px;
}

.two-options {
  max-width: 520px;

  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.departure-time-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}


/* =========================
   CABIN CARDS
========================= */

.cabin-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));

  gap: 10px;
}

.cabin-card {
  min-height: 145px;

  display: flex;
  flex-direction: column;

  padding: 18px;

  border: 1px solid rgba(84, 107, 65, 0.18);
  border-radius: 12px;

  background: #fffdf8;

  cursor: pointer;

  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease;
}

.cabin-card:hover {
  border-color: rgba(84, 107, 65, 0.42);

  transform: translateY(-2px);
}

.cabin-card.selected {
  border-color: var(--color-primary);

  background: rgba(153, 173, 122, 0.17);
}

.cabin-card input {
  position: absolute;

  opacity: 0;

  pointer-events: none;
}

.cabin-name {
  font-family: var(--font-heading);
  font-size: 18px;
  font-weight: 600;

  line-height: 1.2;

  color: var(--color-text);
}

.cabin-description {
  margin-top: 8px;

  font-family: var(--font-body);
  font-size: 12px;
  line-height: 1.5;

  color: #747d70;
}


/* =========================
   TABLET
========================= */

@media (max-width: 1000px) {
  .cabin-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .radio-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .departure-time-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 800px) {
  .budget-grid {
    grid-template-columns: 1fr;
  }

  .cabin-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .departure-time-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}


/* =========================
   MOBILE
========================= */

@media (max-width: 600px) {
  .form-section {
    padding: 30px 0;
  }

  .cabin-grid,
  .radio-grid,
  .two-options,
  .departure-time-grid {
    grid-template-columns: 1fr;
  }

  .cabin-card {
    min-height: auto;
  }
}
</style>