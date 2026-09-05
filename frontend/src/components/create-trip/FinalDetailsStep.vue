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
  <section class="final-details-step">

    <!-- INTRO -->
    <div class="step-intro">
      <p class="step-kicker">
        FINAL DETAILS
      </p>

      <h2>
        Final touches
      </h2>

      <p>
        Add anything else that could help Voyagio personalize your trip,
        then review everything before generating your itinerary.
      </p>
    </div>


    <!-- EXTRA DETAILS -->
    <section class="form-section">
      <div class="section-heading">
        <div class="section-number">
          01
        </div>

        <div>
          <h3>
            Anything we should avoid?
          </h3>

          <p>
            Tell us about activities, places or experiences you'd rather skip.
          </p>
        </div>
      </div>

      <div class="field-group">
        <textarea
          id="things-to-avoid"
          v-model="formData.thingsToAvoid"
          rows="4"
          placeholder="e.g. We don't like crowded clubs or seafood."
        />
      </div>
    </section>


    <section class="form-section">
      <div class="section-heading">
        <div class="section-number">
          02
        </div>

        <div>
          <h3>
            Anything we should know?
          </h3>

          <p>
            Add any context that could help us make the trip feel more personal.
          </p>
        </div>
      </div>

      <div class="field-group">
        <textarea
          id="things-to-know"
          v-model="formData.thingsToKnow"
          rows="4"
          placeholder="e.g. It's our anniversary and we'd like one romantic evening."
        />
      </div>
    </section>


    <section class="form-section">
      <div class="section-heading">
        <div class="section-number">
          03
        </div>

        <div>
          <h3>
            Any special requests?
          </h3>

          <p>
            Add anything specific you'd love to include if possible.
          </p>
        </div>
      </div>

      <div class="field-group">
        <textarea
          id="special-requests"
          v-model="formData.specialRequests"
          rows="4"
          placeholder="e.g. I'd love to see a football match if there is one during our trip."
        />
      </div>
    </section>


    <!-- REVIEW -->
    <section class="review-section">
      <div class="review-intro">
        <p class="review-kicker">
          YOUR TRIP AT A GLANCE
        </p>

        <h3>
          Review your trip
        </h3>

        <p>
          Check that everything looks right before generating your itinerary.
        </p>
      </div>


      <div class="review-grid">

        <!-- TRIP -->
        <article class="review-card">
          <p class="review-card-label">
            TRIP
          </p>

          <h4>
            Trip basics
          </h4>

          <div class="review-list">
            <div class="review-row">
              <span class="review-key">
                Destination
              </span>

              <span class="review-value">
                {{ tripForm.basics.destination.city }},
                {{ tripForm.basics.destination.country }}
              </span>
            </div>

            <div class="review-row">
              <span class="review-key">
                Dates
              </span>

              <span class="review-value">
                {{ tripForm.basics.startDate }}
                →
                {{ tripForm.basics.endDate }}
              </span>
            </div>

            <div class="review-row">
              <span class="review-key">
                Travelers
              </span>

              <span class="review-value">
                {{ tripForm.basics.numberOfTravelers }}
              </span>
            </div>

            <div class="review-row">
              <span class="review-key">
                Traveling with
              </span>

              <span class="review-value">
                {{ tripForm.basics.travelingWith }}
              </span>
            </div>

            <div
              v-if="tripForm.basics.childrenAges"
              class="review-row"
            >
              <span class="review-key">
                Children ages
              </span>

              <span class="review-value">
                {{ tripForm.basics.childrenAges }}
              </span>
            </div>

            <div class="review-row">
              <span class="review-key">
                Pace
              </span>

              <span class="review-value">
                {{ tripForm.basics.pace }}
              </span>
            </div>
          </div>
        </article>


        <!-- INTERESTS -->
        <article class="review-card">
          <p class="review-card-label">
            INTERESTS
          </p>

          <h4>
            What matters to you
          </h4>

          <div class="review-list">
            <div class="review-row stacked">
              <span class="review-key">
                Selected interests
              </span>

              <span class="review-value">
                {{ listOrFallback(tripForm.basics.interests) }}
              </span>
            </div>

            <div class="review-row stacked">
              <span class="review-key">
                Top priorities
              </span>

              <span class="review-value">
                {{ listOrFallback(tripForm.interestPreferences.topPriorities) }}
              </span>
            </div>
          </div>
        </article>


        <!-- STAY -->
        <article class="review-card">
          <p class="review-card-label">
            STAY
          </p>

          <h4>
            Accommodation
          </h4>

          <p
            v-if="tripForm.accommodation.skipRecommendations"
            class="review-note"
          >
            No accommodation recommendations needed.
          </p>

          <div
            v-else
            class="review-list"
          >
            <div class="review-row">
              <span class="review-key">
                Budget
              </span>

              <span class="review-value">
                <template v-if="tripForm.accommodation.budget.amount">
                  {{ tripForm.accommodation.budget.amount }}
                  {{ tripForm.accommodation.budget.currency }}
                  ·
                  {{ tripForm.accommodation.budget.type }}
                </template>

                <template v-else>
                  No specific budget
                </template>
              </span>
            </div>

            <div class="review-row">
              <span class="review-key">
                Level
              </span>

              <span class="review-value">
                {{ tripForm.accommodation.level }}
              </span>
            </div>

            <div class="review-row stacked">
              <span class="review-key">
                Type
              </span>

              <span class="review-value">
                {{ listOrFallback(tripForm.accommodation.types) }}
              </span>
            </div>

            <div class="review-row">
              <span class="review-key">
                Room
              </span>

              <span class="review-value">
                {{ tripForm.accommodation.roomPreference }}
              </span>
            </div>

            <div class="review-row stacked">
              <span class="review-key">
                Preferences
              </span>

              <span class="review-value">
                {{ listOrFallback(tripForm.accommodation.amenities) }}
              </span>
            </div>

            <div class="review-row">
              <span class="review-key">
                Area
              </span>

              <span class="review-value">
                {{ tripForm.accommodation.areaPreference }}
              </span>
            </div>
          </div>
        </article>


        <!-- FLIGHTS -->
        <article class="review-card">
          <p class="review-card-label">
            FLIGHTS
          </p>

          <h4>
            Flight preferences
          </h4>

          <p
            v-if="tripForm.flights.alreadyHaveFlights"
            class="review-note"
          >
            Flights already booked.
          </p>

          <div
            v-else
            class="review-list"
          >
            <div class="review-row">
              <span class="review-key">
                Departure
              </span>

              <span class="review-value">
                {{ tripForm.flights.departureLocation }}
              </span>
            </div>

            <div class="review-row">
              <span class="review-key">
                Trip type
              </span>

              <span class="review-value">
                {{ tripForm.flights.tripType }}
              </span>
            </div>

            <div class="review-row">
              <span class="review-key">
                Budget
              </span>

              <span class="review-value">
                <template v-if="tripForm.flights.budget.amount">
                  {{ tripForm.flights.budget.amount }}
                  {{ tripForm.flights.budget.currency }}
                  ·
                  {{ tripForm.flights.budget.type }}
                </template>

                <template v-else>
                  No specific budget
                </template>
              </span>
            </div>

            <div class="review-row">
              <span class="review-key">
                Cabin
              </span>

              <span class="review-value">
                {{ tripForm.flights.cabinClass }}
              </span>
            </div>

            <div class="review-row">
              <span class="review-key">
                Connections
              </span>

              <span class="review-value">
                {{ tripForm.flights.stops }}
              </span>
            </div>

            <div class="review-row">
              <span class="review-key">
                Preferred departure
              </span>

              <span class="review-value">
                {{ tripForm.flights.preferredDepartureTime }}
              </span>
            </div>

            <div class="review-row">
              <span class="review-key">
                Luggage
              </span>

              <span class="review-value">
                {{ tripForm.flights.luggage }}
              </span>
            </div>

            <div class="review-row stacked">
              <span class="review-key">
                Airline preference
              </span>

              <span class="review-value">
                {{ tripForm.flights.airlinePreference }}
              </span>
            </div>
          </div>
        </article>


        <!-- BUDGET & STYLE -->
        <article class="review-card">
          <p class="review-card-label">
            BUDGET & STYLE
          </p>

          <h4>
            Daily spending
          </h4>

          <div class="review-list">
            <div class="review-row">
              <span class="review-key">
                Spending budget
              </span>

              <span class="review-value">
                <template v-if="tripForm.budgetAndStyle.spendingBudget.amount">
                  {{ tripForm.budgetAndStyle.spendingBudget.amount }}
                  {{ tripForm.budgetAndStyle.spendingBudget.currency }}
                  ·
                  {{ tripForm.budgetAndStyle.spendingBudget.type }}
                </template>

                <template v-else>
                  No specific budget
                </template>
              </span>
            </div>

            <div class="review-row stacked">
              <span class="review-key">
                Travel style
              </span>

              <span class="review-value">
                {{ tripForm.budgetAndStyle.experienceStyle }}
              </span>
            </div>

            <div class="review-row">
              <span class="review-key">
                Daily schedule
              </span>

              <span class="review-value">
                {{ tripForm.budgetAndStyle.dayStartPreference }}
              </span>
            </div>
          </div>
        </article>


        <!-- EXTRA DETAILS -->
        <article class="review-card">
          <p class="review-card-label">
            EXTRA DETAILS
          </p>

          <h4>
            Final notes
          </h4>

          <div class="review-list">
            <div class="review-row stacked">
              <span class="review-key">
                Avoid
              </span>

              <span class="review-value">
                {{ formData.thingsToAvoid || 'Nothing specified' }}
              </span>
            </div>

            <div class="review-row stacked">
              <span class="review-key">
                Important details
              </span>

              <span class="review-value">
                {{ formData.thingsToKnow || 'Nothing specified' }}
              </span>
            </div>

            <div class="review-row stacked">
              <span class="review-key">
                Special requests
              </span>

              <span class="review-value">
                {{ formData.specialRequests || 'Nothing specified' }}
              </span>
            </div>
          </div>
        </article>

      </div>
    </section>


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
        class="generate-button"
        @click="handleGenerate"
      >
        Generate My Itinerary

        <span aria-hidden="true">
          →
        </span>
      </button>
    </div>

  </section>
</template>

<style scoped>
.final-details-step {
  width: 100%;
}


/* =========================
   FORM SECTIONS
========================= */

.form-section {
  padding: 36px 0;

  border-top: 1px solid rgba(84, 107, 65, 0.12);
}


/* =========================
   REVIEW
========================= */

.review-section {
  margin-top: 22px;
  padding-top: 42px;

  border-top: 1px solid rgba(84, 107, 65, 0.12);
}

.review-intro {
  max-width: 700px;

  margin-bottom: 26px;
}

.review-kicker {
  margin: 0 0 8px;

  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.16em;

  color: var(--color-accent);
}

.review-intro h3 {
  margin: 0;

  font-family: var(--font-heading);
  font-size: 32px;
  font-weight: 600;

  color: var(--color-text);
}

.review-intro > p:last-child {
  margin: 10px 0 0;

  font-family: var(--font-body);
  font-size: 14px;
  line-height: 1.6;

  color: #747d70;
}

.review-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 14px;
}

.review-card {
  padding: 24px;

  border: 1px solid rgba(84, 107, 65, 0.14);
  border-radius: var(--border-radius-medium);

  background: #fffdf8;
}

.review-card-label {
  margin: 0 0 7px;

  font-family: var(--font-body);
  font-size: 9px;
  font-weight: 700;

  letter-spacing: 0.15em;

  color: var(--color-accent);
}

.review-card h4 {
  margin: 0 0 20px;

  font-family: var(--font-heading);
  font-size: 21px;
  font-weight: 600;

  color: var(--color-text);
}

.review-list {
  display: flex;
  flex-direction: column;
}

.review-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 20px;

  padding: 11px 0;

  border-top: 1px solid rgba(84, 107, 65, 0.08);
}

.review-row:first-child {
  padding-top: 0;

  border-top: 0;
}

.review-row.stacked {
  flex-direction: column;

  gap: 5px;
}

.review-key {
  flex-shrink: 0;

  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 700;

  color: #727b6e;
}

.review-value {
  font-family: var(--font-body);
  font-size: 13px;
  line-height: 1.5;

  text-align: right;

  color: var(--color-text);
}

.review-row.stacked .review-value {
  text-align: left;
}

.review-note {
  margin: 0;

  padding: 14px;

  border-radius: var(--border-radius-small);

  background: rgba(153, 173, 122, 0.12);

  font-family: var(--font-body);
  font-size: 13px;
  line-height: 1.5;

  color: #596453;
}


/* =========================
   GENERATE BUTTON
========================= */

.generate-button {
  min-height: 52px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 12px;

  padding: 0 24px;

  border: 1px solid var(--color-primary);
  border-radius: var(--border-radius-small);

  background: var(--color-primary);

  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 700;

  color: var(--color-background);

  cursor: pointer;

  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.generate-button:hover {
  background: #455936;
  border-color: #455936;

  transform: translateY(-1px);
}


/* =========================
   TABLET
========================= */

@media (max-width: 850px) {
  .review-grid {
    grid-template-columns: 1fr;
  }
}


/* =========================
   MOBILE
========================= */

@media (max-width: 600px) {
  .form-section {
    padding: 30px 0;
  }

  .review-section {
    padding-top: 34px;
  }

  .review-intro h3 {
    font-size: 27px;
  }

  .review-card {
    padding: 20px 18px;
  }

  .review-row {
    flex-direction: column;

    gap: 5px;
  }

  .review-value {
    text-align: left;
  }

  .generate-button {
    width: 100%;
  }
}
</style>