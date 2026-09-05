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

const budgetTypes = [
  'Per person',
  'Total'
]

const experienceStyles = [
  'Must-see attractions',
  'Mix of famous places & hidden gems',
  'Mostly local & hidden gems'
]

const dayStartPreferences = [
  'Early starter',
  'Normal days',
  'Late mornings'
]

function handleNext() {
  if (
    props.formData.spendingBudget.amount !== '' &&
    props.formData.spendingBudget.amount < 0
  ) {
    alert('Please enter a valid spending budget.')
    return
  }

  if (!props.formData.experienceStyle) {
    alert('Please select the kind of experience you prefer.')
    return
  }

  if (!props.formData.dayStartPreference) {
    alert('Please select when you usually like to start your days.')
    return
  }

  emit('next')
}
</script>

<template>
  <section class="budget-step">

    <!-- INTRO -->
    <div class="step-intro">
      <p class="step-kicker">
        BUDGET & STYLE
      </p>

      <h2>
        How do you want this trip to feel?
      </h2>

      <p>
        Tell us how you'd like to spend your time and money so Voyagio can
        shape the itinerary around your travel style.
      </p>
    </div>


    <!-- SPENDING BUDGET -->
    <section class="form-section">
      <div class="section-heading">
        <div class="section-number">
          01
        </div>

        <div>
          <h3>
            Spending budget
          </h3>

          <p>
            This excludes flights and accommodation. Think about food,
            activities, local transport and other day-to-day spending.
          </p>
        </div>
      </div>

      <div class="budget-grid">
        <div class="field-group">
          <label for="spending-budget">
            Amount
          </label>

          <input
            id="spending-budget"
            v-model.number="formData.spendingBudget.amount"
            type="number"
            min="0"
            placeholder="e.g. 1000"
          >
        </div>

        <div class="field-group">
          <label for="spending-currency">
            Currency
          </label>

          <select
            id="spending-currency"
            v-model="formData.spendingBudget.currency"
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
            v-for="type in budgetTypes"
            :key="type"
            class="radio-card"
            :class="{ selected: formData.spendingBudget.type === type }"
          >
            <input
              v-model="formData.spendingBudget.type"
              type="radio"
              name="spending-budget-type"
              :value="type"
            >

            <span>
              {{ type }}
            </span>
          </label>
        </div>
      </div>
    </section>


    <!-- EXPERIENCE STYLE -->
    <section class="form-section">
      <div class="section-heading">
        <div class="section-number">
          02
        </div>

        <div>
          <h3>
            What kind of experience do you prefer?
          </h3>

          <p>
            Tell us how much you want to focus on iconic sights versus local
            and less obvious places.
          </p>
        </div>
      </div>

      <div class="experience-grid">
        <label
          v-for="style in experienceStyles"
          :key="style"
          class="experience-card"
          :class="{ selected: formData.experienceStyle === style }"
        >
          <input
            v-model="formData.experienceStyle"
            type="radio"
            name="experience-style"
            :value="style"
          >

          <span class="experience-title">
            {{ style }}
          </span>

          <span
            v-if="style === 'Must-see attractions'"
            class="experience-description"
          >
            Focus on the destination's most famous and essential places.
          </span>

          <span
            v-else-if="style === 'Mix of famous places & hidden gems'"
            class="experience-description"
          >
            Balance iconic attractions with more local and less obvious finds.
          </span>

          <span
            v-else
            class="experience-description"
          >
            Prioritize local atmosphere, lesser-known places and hidden gems.
          </span>
        </label>
      </div>
    </section>


    <!-- DAY START -->
    <section class="form-section">
      <div class="section-heading">
        <div class="section-number">
          03
        </div>

        <div>
          <h3>
            When do you like to start your days?
          </h3>

          <p>
            This helps us shape the rhythm of each day without forcing exact
            meal or activity times.
          </p>
        </div>
      </div>

      <div class="day-start-grid">
        <label
          v-for="preference in dayStartPreferences"
          :key="preference"
          class="day-start-card"
          :class="{ selected: formData.dayStartPreference === preference }"
        >
          <input
            v-model="formData.dayStartPreference"
            type="radio"
            name="day-start-preference"
            :value="preference"
          >

          <span class="day-start-title">
            {{ preference }}
          </span>

          <span
            v-if="preference === 'Early starter'"
            class="day-start-description"
          >
            You don't mind getting out early and making the most of the morning.
          </span>

          <span
            v-else-if="preference === 'Normal days'"
            class="day-start-description"
          >
            A comfortable start without being especially early or late.
          </span>

          <span
            v-else
            class="day-start-description"
          >
            You prefer slower mornings and starting the day later.
          </span>
        </label>
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
        class="next-button"
        @click="handleNext"
      >
        Next: Final details

        <span aria-hidden="true">
          →
        </span>
      </button>
    </div>

  </section>
</template>

<style scoped>
.budget-step {
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

.radio-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  gap: 10px;
}

.two-options {
  max-width: 520px;
}


/* =========================
   EXPERIENCE STYLE
========================= */

.experience-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  gap: 12px;
}

.experience-card {
  min-height: 155px;

  display: flex;
  flex-direction: column;

  padding: 20px;

  border: 1px solid rgba(84, 107, 65, 0.18);
  border-radius: 12px;

  background: #fffdf8;

  cursor: pointer;

  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease;
}

.experience-card:hover {
  border-color: rgba(84, 107, 65, 0.42);

  transform: translateY(-2px);
}

.experience-card.selected {
  border-color: var(--color-primary);

  background: rgba(153, 173, 122, 0.17);
}

.experience-card input {
  position: absolute;

  opacity: 0;

  pointer-events: none;
}

.experience-title {
  font-family: var(--font-heading);
  font-size: 19px;
  font-weight: 600;
  line-height: 1.25;

  color: var(--color-text);
}

.experience-description {
  margin-top: 10px;

  font-family: var(--font-body);
  font-size: 12px;
  line-height: 1.55;

  color: #747d70;
}


/* =========================
   DAY START
========================= */

.day-start-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  gap: 12px;
}

.day-start-card {
  min-height: 145px;

  display: flex;
  flex-direction: column;

  padding: 20px;

  border: 1px solid rgba(84, 107, 65, 0.18);
  border-radius: 12px;

  background: #fffdf8;

  cursor: pointer;

  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease;
}

.day-start-card:hover {
  border-color: rgba(84, 107, 65, 0.42);

  transform: translateY(-2px);
}

.day-start-card.selected {
  border-color: var(--color-primary);

  background: rgba(153, 173, 122, 0.17);
}

.day-start-card input {
  position: absolute;

  opacity: 0;

  pointer-events: none;
}

.day-start-title {
  font-family: var(--font-heading);
  font-size: 20px;
  font-weight: 600;

  color: var(--color-text);
}

.day-start-description {
  margin-top: 9px;

  font-family: var(--font-body);
  font-size: 12px;
  line-height: 1.55;

  color: #747d70;
}


/* =========================
   TABLET
========================= */

@media (max-width: 900px) {
  .experience-grid,
  .day-start-grid {
    grid-template-columns: 1fr;
  }

  .experience-card,
  .day-start-card {
    min-height: auto;
  }
}


/* =========================
   MOBILE
========================= */

@media (max-width: 600px) {
  .form-section {
    padding: 30px 0;
  }

  .budget-grid,
  .radio-grid {
    grid-template-columns: 1fr;
  }
}
</style>