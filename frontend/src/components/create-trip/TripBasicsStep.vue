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
  <section class="trip-basics-step">
    <div class="step-intro">
      <p class="step-kicker">
        TRIP BASICS
      </p>

      <h2>
        Tell us about your trip
      </h2>

      <p>
        Start with the essentials. You can refine the details in the next steps.
      </p>
    </div>

    <!-- DESTINATION -->
    <section class="form-section">
      <div class="section-heading">
        <div class="section-number">
          01
        </div>

        <div>
          <h3>
            Where do you want to go?
          </h3>

          <p>
            Choose the city and country for this trip.
          </p>
        </div>
      </div>

      <div class="two-column-grid">
        <div class="field-group">
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

        <div class="field-group">
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
      </div>

      <p
        v-if="destinationError"
        class="field-error"
      >
        {{ destinationError }}
      </p>
    </section>

    <!-- DATES -->
    <section class="form-section">
      <div class="section-heading">
        <div class="section-number">
          02
        </div>

        <div>
          <h3>
            When are you going?
          </h3>

          <p>
            Select the start and end dates for your trip.
          </p>
        </div>
      </div>

      <div class="two-column-grid">
        <div class="field-group">
          <label for="start-date">
            Start date
          </label>

          <input
            id="start-date"
            v-model="formData.startDate"
            type="date"
          >
        </div>

        <div class="field-group">
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
    </section>

    <!-- TRAVELING WITH -->
    <section class="form-section">
      <div class="section-heading">
        <div class="section-number">
          03
        </div>

        <div>
          <h3>
            Who are you traveling with?
          </h3>

          <p>
            This helps Voyagio adjust recommendations and pace.
          </p>
        </div>
      </div>

      <div class="choice-grid companion-grid">
        <label
          v-for="option in travelCompanions"
          :key="option"
          class="choice-card"
          :class="{ selected: formData.travelingWith === option }"
        >
          <input
            v-model="formData.travelingWith"
            type="radio"
            name="traveling-with"
            :value="option"
          >

          <span>
            {{ option }}
          </span>
        </label>
      </div>

      <div class="traveler-details">
        <div class="field-group small-field">
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

        <div
          v-if="formData.travelingWith === 'With children'"
          class="field-group"
        >
          <label for="children-ages">
            Ages of children
          </label>

          <input
            id="children-ages"
            v-model="formData.childrenAges"
            type="text"
            placeholder="e.g. 4, 8"
          >

          <p class="field-hint">
            Separate multiple ages with commas.
          </p>
        </div>
      </div>
    </section>

    <!-- PACE -->
    <section class="form-section">
      <div class="section-heading">
        <div class="section-number">
          04
        </div>

        <div>
          <h3>
            What's your travel pace?
          </h3>

          <p>
            Pace controls how full your days feel, not how far you are allowed to travel.
          </p>
        </div>
      </div>

      <div class="pace-grid">
        <label
          v-for="pace in travelPaces"
          :key="pace"
          class="pace-card"
          :class="{ selected: formData.pace === pace }"
        >
          <input
            v-model="formData.pace"
            type="radio"
            name="travel-pace"
            :value="pace"
          >

          <span class="pace-name">
            {{ pace }}
          </span>

          <span
            v-if="pace === 'Relaxed'"
            class="pace-description"
          >
            Fewer activities, more breathing room.
          </span>

          <span
            v-else-if="pace === 'Balanced'"
            class="pace-description"
          >
            A comfortable mix of exploring and downtime.
          </span>

          <span
            v-else
            class="pace-description"
          >
            Full, active days with plenty to experience.
          </span>
        </label>
      </div>
    </section>

    <!-- INTERESTS -->
    <section class="form-section">
      <div class="section-heading">
        <div class="section-number">
          05
        </div>

        <div>
          <h3>
            What are you interested in?
          </h3>

          <p>
            Select everything you'd like Voyagio to consider.
          </p>
        </div>
      </div>

      <div class="interest-grid">
        <button
          v-for="interest in interests"
          :key="interest"
          type="button"
          class="option-chip"
          :class="{ selected: formData.interests.includes(interest) }"
          @click="toggleInterest(interest)"
        >
          <span
            v-if="formData.interests.includes(interest)"
            class="checkmark"
          >
            ✓
          </span>

          {{ interest }}
        </button>
      </div>
    </section>

    <!-- NEXT -->
    <div class="step-actions">
      <p class="selection-summary">
        {{ formData.interests.length }}
        {{ formData.interests.length === 1 ? 'interest' : 'interests' }}
        selected
      </p>

      <button
        type="button"
        class="next-button"
        :disabled="isValidatingDestination"
        @click="handleNext"
      >
        {{
          isValidatingDestination
            ? 'Validating destination...'
            : 'Next: Your interests'
        }}

        <span
          v-if="!isValidatingDestination"
          aria-hidden="true"
        >
          →
        </span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.trip-basics-step {
  width: 100%;
}


/* =========================
   FORM SECTIONS
========================= */

.form-section {
  padding: 34px 0;

  border-top: 1px solid rgba(84, 107, 65, 0.12);
}

.form-section:first-of-type {
  padding-top: 0;

  border-top: 0;
}


/* =========================
   DESTINATION + DATES
========================= */

.two-column-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 18px;
}


/* =========================
   TRAVEL COMPANIONS
========================= */

.choice-grid {
  display: grid;

  gap: 12px;
}

.companion-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.choice-card {
  min-height: 54px;

  display: flex;
  align-items: center;

  padding: 0 16px;

  border: 1px solid rgba(84, 107, 65, 0.18);
  border-radius: var(--border-radius-small);

  background: #fffdf8;

  cursor: pointer;

  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease;
}

.choice-card:hover {
  border-color: rgba(84, 107, 65, 0.4);

  transform: translateY(-1px);
}

.choice-card.selected {
  border-color: var(--color-primary);

  background: rgba(153, 173, 122, 0.16);
}

.choice-card input {
  position: absolute;

  opacity: 0;

  pointer-events: none;
}

.choice-card span {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;

  color: #3e493b;
}

.traveler-details {
  display: grid;
  grid-template-columns:
    minmax(180px, 0.35fr)
    minmax(0, 1fr);

  gap: 18px;

  margin-top: 18px;
}

.small-field {
  max-width: 220px;
}


/* =========================
   PACE
========================= */

.pace-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  gap: 14px;
}

.pace-card {
  min-height: 150px;

  display: flex;
  flex-direction: column;

  padding: 22px;

  border: 1px solid rgba(84, 107, 65, 0.18);
  border-radius: 12px;

  background: #fffdf8;

  cursor: pointer;

  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease;
}

.pace-card:hover {
  border-color: rgba(84, 107, 65, 0.4);

  transform: translateY(-2px);
}

.pace-card.selected {
  border-color: var(--color-primary);

  background: rgba(153, 173, 122, 0.17);
}

.pace-card input {
  position: absolute;

  opacity: 0;

  pointer-events: none;
}

.pace-name {
  font-family: var(--font-heading);
  font-size: 22px;
  font-weight: 600;

  color: var(--color-text);
}

.pace-description {
  margin-top: 10px;

  font-family: var(--font-body);
  font-size: 13px;
  line-height: 1.55;

  color: #747d70;
}


/* =========================
   INTERESTS
========================= */

.interest-grid {
  display: flex;
  flex-wrap: wrap;

  gap: 10px;
}

.checkmark {
  font-size: 13px;
}


/* =========================
   ACTION AREA
========================= */

.selection-summary {
  margin: 0;

  font-family: var(--font-body);
  font-size: 13px;

  color: #80887c;
}


/* =========================
   TABLET
========================= */

@media (max-width: 850px) {
  .companion-grid,
  .pace-grid {
    grid-template-columns: 1fr 1fr;
  }

  .traveler-details {
    grid-template-columns: 1fr;
  }

  .small-field {
    max-width: none;
  }
}


/* =========================
   MOBILE
========================= */

@media (max-width: 600px) {
  .form-section {
    padding: 28px 0;
  }

  .two-column-grid,
  .companion-grid,
  .pace-grid {
    grid-template-columns: 1fr;
  }

  .pace-card {
    min-height: auto;
  }

  .step-actions {
    flex-direction: column;
  }

  .selection-summary {
    text-align: center;
  }

  .next-button {
    justify-content: space-between;
  }
}
</style>