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
  <section class="stay-step">
    <div class="step-intro">
      <p class="step-kicker">
        YOUR STAY
      </p>

      <h2>
        Where would you like to stay?
      </h2>

      <p>
        Tell us what kind of accommodation would suit your trip.
        You can be as specific or as flexible as you like.
      </p>
    </div>

    <!-- SKIP RECOMMENDATIONS -->
    <section class="skip-card">
      <label class="skip-option">
        <input
          v-model="formData.skipRecommendations"
          type="checkbox"
        >

        <span class="custom-checkbox">
          <span v-if="formData.skipRecommendations">
            ✓
          </span>
        </span>

        <span class="skip-copy">
          <strong>
            I already have accommodation
          </strong>

          <span>
            Skip hotel and stay recommendations for this trip.
          </span>
        </span>
      </label>
    </section>

    <template v-if="!formData.skipRecommendations">

      <!-- BUDGET -->
      <section class="form-section">
        <div class="section-heading">
          <div class="section-number">
            01
          </div>

          <div>
            <h3>
              Accommodation budget
            </h3>

            <p>
              This budget is for the accommodation as a whole, not per person.
              Leave it empty if you don't have a specific limit.
            </p>
          </div>
        </div>

        <div class="budget-grid">
          <div class="field-group">
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

          <div class="field-group">
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
        </div>

        <div class="preference-group budget-type-group">
          <h4>
            How should we interpret this budget?
          </h4>

          <div class="radio-grid two-options">
            <label
              class="radio-card"
              :class="{ selected: formData.budget.type === 'Per night' }"
            >
              <input
                v-model="formData.budget.type"
                type="radio"
                name="accommodation-budget-type"
                value="Per night"
              >

              <span>
                Per night
              </span>
            </label>

            <label
              class="radio-card"
              :class="{ selected: formData.budget.type === 'Total trip' }"
            >
              <input
                v-model="formData.budget.type"
                type="radio"
                name="accommodation-budget-type"
                value="Total trip"
              >

              <span>
                Total trip
              </span>
            </label>
          </div>
        </div>
      </section>

      <!-- ACCOMMODATION LEVEL -->
      <section class="form-section">
        <div class="section-heading">
          <div class="section-number">
            02
          </div>

          <div>
            <h3>
              What level of accommodation do you prefer?
            </h3>

            <p>
              Choose the general comfort and price level you'd like us to consider.
            </p>
          </div>
        </div>

        <div class="level-grid">
          <label
            v-for="level in accommodationLevels"
            :key="level"
            class="level-card"
            :class="{ selected: formData.level === level }"
          >
            <input
              v-model="formData.level"
              type="radio"
              name="accommodation-level"
              :value="level"
            >

            <span class="level-name">
              {{ level }}
            </span>

            <span
              v-if="level === 'No preference'"
              class="level-description"
            >
              Keep all suitable options open.
            </span>

            <span
              v-else-if="level === 'Budget'"
              class="level-description"
            >
              Simple and practical stays.
            </span>

            <span
              v-else-if="level === 'Mid-range'"
              class="level-description"
            >
              Comfortable without going overboard.
            </span>

            <span
              v-else-if="level === 'Upscale'"
              class="level-description"
            >
              Higher comfort and better amenities.
            </span>

            <span
              v-else
              class="level-description"
            >
              Premium stays and elevated service.
            </span>
          </label>
        </div>
      </section>

      <!-- ACCOMMODATION TYPE -->
      <section class="form-section">
        <div class="section-heading">
          <div class="section-number">
            03
          </div>

          <div>
            <h3>
              What type of accommodation do you prefer?
            </h3>

            <p>
              You can choose more than one.
            </p>
          </div>
        </div>

        <div class="option-grid">
          <button
            v-for="type in accommodationTypes"
            :key="type"
            type="button"
            class="option-chip"
            :class="{ selected: formData.types.includes(type) }"
            @click="toggleArrayValue(formData.types, type)"
          >
            <span v-if="formData.types.includes(type)">
              ✓
            </span>

            {{ type }}
          </button>
        </div>
      </section>

      <!-- ROOM -->
      <section class="form-section">
        <div class="section-heading">
          <div class="section-number">
            04
          </div>

          <div>
            <h3>
              What kind of room would you prefer?
            </h3>

            <p>
              Choose the setup that best fits your group.
            </p>
          </div>
        </div>

        <div class="room-grid">
          <label
            v-for="room in roomPreferences"
            :key="room"
            class="radio-card"
            :class="{ selected: formData.roomPreference === room }"
          >
            <input
              v-model="formData.roomPreference"
              type="radio"
              name="room-preference"
              :value="room"
            >

            <span>
              {{ room }}
            </span>
          </label>
        </div>
      </section>

      <!-- AMENITIES -->
      <section class="form-section">
        <div class="section-heading">
          <div class="section-number">
            05
          </div>

          <div>
            <h3>
              What matters to you?
            </h3>

            <p>
              Select anything you'd like us to consider when recommending stays.
            </p>
          </div>
        </div>

        <div class="option-grid">
          <button
            v-for="amenity in amenities"
            :key="amenity"
            type="button"
            class="option-chip"
            :class="{ selected: formData.amenities.includes(amenity) }"
            @click="toggleArrayValue(formData.amenities, amenity)"
          >
            <span v-if="formData.amenities.includes(amenity)">
              ✓
            </span>

            {{ amenity }}
          </button>
        </div>
      </section>

      <!-- AREA -->
      <section class="form-section">
        <div class="section-heading">
          <div class="section-number">
            06
          </div>

          <div>
            <h3>
              What kind of area would you prefer?
            </h3>

            <p>
              Think about the atmosphere you'd like around your accommodation.
            </p>
          </div>
        </div>

        <div class="radio-grid">
          <label
            v-for="area in areaPreferences"
            :key="area"
            class="radio-card"
            :class="{ selected: formData.areaPreference === area }"
          >
            <input
              v-model="formData.areaPreference"
              type="radio"
              name="area-preference"
              :value="area"
            >

            <span>
              {{ area }}
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
        Next: Flights

        <span aria-hidden="true">
          →
        </span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.stay-step {
  width: 100%;
}


/* =========================
   INTRO
========================= */

.step-intro {
  max-width: 700px;

  margin-bottom: 34px;
}

.step-kicker {
  margin: 0 0 10px;

  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.15em;

  color: #be9264;
}

.step-intro h2 {
  margin: 0;

  font-family: 'Playfair Display', serif;
  font-size: 36px;
  font-weight: 600;
  line-height: 1.1;

  color: #263025;
}

.step-intro > p:last-child {
  margin: 14px 0 0;

  font-family: 'DM Sans', sans-serif;
  font-size: 15px;
  line-height: 1.65;

  color: #70796b;
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

  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 800;

  color: #fff8ec;

  transition:
    background 0.2s ease,
    border-color 0.2s ease;
}

.skip-option input:checked + .custom-checkbox {
  border-color: #546b41;

  background: #546b41;
}

.skip-copy {
  display: flex;
  flex-direction: column;

  gap: 4px;
}

.skip-copy strong {
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;

  color: #263025;
}

.skip-copy > span {
  font-family: 'DM Sans', sans-serif;
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

.section-heading {
  display: flex;
  align-items: flex-start;

  gap: 16px;

  margin-bottom: 24px;
}

.section-number {
  width: 34px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 10px;

  background: rgba(153, 173, 122, 0.18);

  font-family: 'DM Sans', sans-serif;
  font-size: 11px;
  font-weight: 700;

  color: #546b41;
}

.section-heading h3 {
  margin: 0;

  font-family: 'Playfair Display', serif;
  font-size: 25px;
  font-weight: 600;

  color: #263025;
}

.section-heading p {
  max-width: 680px;

  margin: 6px 0 0;

  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  line-height: 1.55;

  color: #747d70;
}


/* =========================
   FIELDS
========================= */

.budget-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 180px;

  gap: 18px;
}

.field-group {
  display: flex;
  flex-direction: column;

  gap: 8px;
}

.field-group label {
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 700;

  color: #3e493b;
}

.field-group input,
.field-group select {
  width: 100%;
  min-height: 48px;

  box-sizing: border-box;

  padding: 0 14px;

  border: 1px solid rgba(84, 107, 65, 0.22);
  border-radius: 10px;

  background: #fffdf8;

  font-family: 'DM Sans', sans-serif;
  font-size: 14px;

  color: #263025;

  outline: none;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.field-group input::placeholder {
  color: #a0a69c;
}

.field-group input:focus,
.field-group select:focus {
  border-color: #546b41;

  background: #ffffff;

  box-shadow: 0 0 0 3px rgba(84, 107, 65, 0.1);
}


/* =========================
   PREFERENCE GROUPS
========================= */

.preference-group {
  margin-top: 24px;
}

.preference-group h4 {
  margin: 0 0 14px;

  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 700;

  color: #3e493b;
}


/* =========================
   OPTION CHIPS
========================= */

.option-grid {
  display: flex;
  flex-wrap: wrap;

  gap: 10px;
}

.option-chip {
  min-height: 42px;

  display: inline-flex;
  align-items: center;

  gap: 7px;

  padding: 0 15px;

  border: 1px solid rgba(84, 107, 65, 0.18);
  border-radius: 10px;

  background: #fffdf8;

  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;

  color: #4a5545;

  cursor: pointer;

  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.option-chip:hover {
  border-color: rgba(84, 107, 65, 0.42);

  transform: translateY(-1px);
}

.option-chip.selected {
  border-color: #546b41;

  background: #546b41;

  color: #fff8ec;
}


/* =========================
   RADIO CARDS
========================= */

.radio-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  gap: 10px;
}

.two-options {
  grid-template-columns: repeat(2, minmax(0, 1fr));

  max-width: 520px;
}

.radio-card {
  min-height: 54px;

  display: flex;
  align-items: center;

  padding: 0 16px;

  border: 1px solid rgba(84, 107, 65, 0.18);
  border-radius: 10px;

  background: #fffdf8;

  cursor: pointer;

  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease;
}

.radio-card:hover {
  border-color: rgba(84, 107, 65, 0.42);

  transform: translateY(-1px);
}

.radio-card.selected {
  border-color: #546b41;

  background: rgba(153, 173, 122, 0.17);
}

.radio-card input {
  position: absolute;

  opacity: 0;

  pointer-events: none;
}

.radio-card span {
  font-family: 'DM Sans', sans-serif;
  font-size: 13px;
  font-weight: 600;

  color: #3e493b;
}


/* =========================
   LEVEL CARDS
========================= */

.level-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));

  gap: 10px;
}

.level-card {
  min-height: 138px;

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

.level-card:hover {
  border-color: rgba(84, 107, 65, 0.42);

  transform: translateY(-2px);
}

.level-card.selected {
  border-color: #546b41;

  background: rgba(153, 173, 122, 0.17);
}

.level-card input {
  position: absolute;

  opacity: 0;

  pointer-events: none;
}

.level-name {
  font-family: 'Playfair Display', serif;
  font-size: 18px;
  font-weight: 600;

  color: #263025;
}

.level-description {
  margin-top: 8px;

  font-family: 'DM Sans', sans-serif;
  font-size: 12px;
  line-height: 1.5;

  color: #747d70;
}


/* =========================
   ROOM GRID
========================= */

.room-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));

  gap: 10px;
}


/* =========================
   ACTIONS
========================= */

.step-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;

  padding-top: 32px;

  border-top: 1px solid rgba(84, 107, 65, 0.12);
}

.back-button,
.next-button {
  min-height: 50px;

  display: inline-flex;
  align-items: center;

  padding: 0 22px;

  border-radius: 10px;

  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  font-weight: 700;

  cursor: pointer;

  transition:
    background 0.2s ease,
    color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.back-button {
  border: 1px solid rgba(84, 107, 65, 0.28);

  background: transparent;

  color: #546b41;
}

.back-button:hover {
  border-color: #546b41;

  background: rgba(153, 173, 122, 0.1);
}

.next-button {
  gap: 12px;

  border: 1px solid #546b41;

  background: #546b41;

  color: #fff8ec;
}

.next-button:hover {
  background: #455936;
  border-color: #455936;

  transform: translateY(-1px);
}


/* =========================
   TABLET
========================= */

@media (max-width: 1000px) {
  .level-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .room-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 800px) {
  .budget-grid {
    grid-template-columns: 1fr;
  }

  .level-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .radio-grid {
    grid-template-columns: 1fr 1fr;
  }
}


/* =========================
   MOBILE
========================= */

@media (max-width: 600px) {
  .step-intro {
    margin-bottom: 28px;
  }

  .step-intro h2 {
    font-size: 30px;
  }

  .form-section {
    padding: 30px 0;
  }

  .section-heading {
    gap: 12px;
  }

  .section-heading h3 {
    font-size: 22px;
  }

  .level-grid,
  .room-grid,
  .radio-grid,
  .two-options {
    grid-template-columns: 1fr;
  }

  .level-card {
    min-height: auto;
  }

  .step-actions {
    align-items: stretch;
    flex-direction: column-reverse;
  }

  .back-button,
  .next-button {
    width: 100%;

    justify-content: center;
  }
}
</style>