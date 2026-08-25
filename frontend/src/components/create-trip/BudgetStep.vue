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
  <section>
    <p>Step 5 of 6</p>

    <h1>Budget & travel style</h1>

    <p>
      Help us understand how you'd like to spend your time and money.
    </p>

    <!-- Spending budget -->
    <div>
      <h2>Spending budget</h2>

      <p>
        This budget excludes flights and accommodation.
      </p>

      <p>
        Think about food, activities, local transport and other day-to-day spending.
      </p>

      <div>
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

      <div>
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

      <div>
        <label
          v-for="type in budgetTypes"
          :key="type"
        >
          <input
            v-model="formData.spendingBudget.type"
            type="radio"
            name="spending-budget-type"
            :value="type"
          >

          {{ type }}
        </label>
      </div>
    </div>

    <!-- Tourist vs local -->
    <div>
      <h2>What kind of experience do you prefer?</h2>

      <label
        v-for="style in experienceStyles"
        :key="style"
      >
        <input
          v-model="formData.experienceStyle"
          type="radio"
          name="experience-style"
          :value="style"
        >

        {{ style }}
      </label>
    </div>

    <!-- Daily schedule -->
    <div>
      <h2>When do you like to start your days?</h2>

      <label
        v-for="preference in dayStartPreferences"
        :key="preference"
      >
        <input
          v-model="formData.dayStartPreference"
          type="radio"
          name="day-start-preference"
          :value="preference"
        >

        {{ preference }}
      </label>
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
        @click="handleNext"
      >
        Next
      </button>
    </div>
  </section>
</template>