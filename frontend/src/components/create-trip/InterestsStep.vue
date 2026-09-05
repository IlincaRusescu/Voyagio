<script setup>
import { computed } from 'vue'

const props = defineProps({
  selectedInterests: {
    type: Array,
    required: true
  },

  formData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['next', 'back'])

const options = {
  food: {
    cuisines: [
      'No preference',
      'Local cuisine',
      'Italian',
      'French',
      'Spanish',
      'Greek',
      'Turkish',
      'Lebanese',
      'Middle Eastern',
      'Mexican',
      'American',
      'Japanese',
      'Korean',
      'Chinese',
      'Thai',
      'Indian',
      'Mediterranean',
      'Seafood',
      'Vegetarian/Vegan'
    ],

    places: [
      'Local restaurants',
      'Hidden gems',
      'Street food',
      'Cafés & bakeries',
      'Popular & trendy places',
      'Fine dining',
      'Food markets'
    ],

    spending: [
      'Budget',
      'Moderate',
      "Don't mind spending more",
      'Mix it up'
    ]
  },

  nightlife: {
    types: [
      'Cocktail bars',
      'Pubs',
      'Clubs',
      'Rooftop bars',
      'Live music',
      'Beach clubs',
      'Wine bars',
      'Alternative & underground'
    ],

    music: [
      'No preference',
      'Pop',
      'Commercial',
      'Hip-hop & R&B',
      'House',
      'Techno',
      'Latin',
      'Rock & Alternative'
    ]
  },

  culture: {
    types: [
      'History',
      'Art',
      'Architecture',
      'Museums',
      'Archaeology',
      'Religious sites',
      'Local traditions'
    ],

    amount: [
      'Highlights only',
      'Balanced',
      'As much as possible'
    ]
  },

  nature: {
    types: [
      'Parks & gardens',
      'Mountains',
      'Lakes & rivers',
      'Waterfalls',
      'Forests',
      'Scenic viewpoints',
      'Wildlife',
      'Hiking'
    ],

    hikingDifficulty: [
      'Easy',
      'Moderate',
      'Challenging'
    ]
  },

  beaches: {
    types: [
      'No preference',
      'Sandy',
      'Scenic & wild',
      'Quiet',
      'Lively',
      'Beach clubs',
      'Clear water & snorkeling',
      'Water sports'
    ],

    time: [
      'A few hours',
      'Half days',
      'Full beach days'
    ]
  },

  relaxation: {
    types: [
      'Spa',
      'Massage',
      'Thermal baths',
      'Wellness',
      'Slow mornings',
      'Pool time',
      'Scenic cafés',
      'Peaceful walks',
      'Yoga'
    ],

    downtime: [
      'A little',
      'Some every day',
      'Lots of free time'
    ]
  },

  shopping: [
    'Local boutiques',
    'Vintage & second-hand',
    'Luxury',
    'Fashion',
    'Shopping malls',
    'Local markets',
    'Souvenirs',
    'Beauty & cosmetics'
  ],

  adventure: {
    types: [
      'Kayaking',
      'Rafting',
      'Diving',
      'Snorkeling',
      'Surfing',
      'Skiing',
      'Climbing',
      'Ziplining',
      'ATV & quad',
      'Boat activities',
      'Adrenaline activities'
    ],

    intensity: [
      'Beginner-friendly',
      'Moderate',
      'Give me adrenaline'
    ]
  },

  entertainment: [
    'Theme parks',
    'Water parks',
    'Shows',
    'Theatre',
    'Concerts',
    'Live music',
    'Sports events',
    'Gaming & interactive experiences',
    'Zoos & aquariums'
  ],

  photography: [
    'Iconic landmarks',
    'Architecture',
    'Pretty streets',
    'Scenic viewpoints',
    'Nature',
    'Sunset spots',
    'Street photography',
    'Colorful & unique places'
  ]
}

const hasClubs = computed(() => {
  return props.formData.nightlife?.types?.includes('Clubs')
})

const hasHiking = computed(() => {
  return props.formData.nature?.types?.includes('Hiking')
})

function hasInterest(interest) {
  return props.selectedInterests.includes(interest)
}

function toggleArrayValue(array, value) {
  const index = array.indexOf(value)

  if (index === -1) {
    array.push(value)
  } else {
    array.splice(index, 1)
  }
}

function togglePriority(interest) {
  const priorities = props.formData.topPriorities

  const index = priorities.indexOf(interest)

  if (index !== -1) {
    priorities.splice(index, 1)
    return
  }

  if (priorities.length >= 3) {
    return
  }

  priorities.push(interest)
}

function handleNext() {
  if (
    props.selectedInterests.length > 3 &&
    props.formData.topPriorities.length === 0
  ) {
    alert('Please choose your top priorities.')
    return
  }

  emit('next')
}
</script>

<template>
  <section class="interests-step">
    <div class="step-intro">
      <p class="step-kicker">
        YOUR INTERESTS
      </p>

      <h2>
        Tell us what you love
      </h2>

      <p>
        Fine-tune the interests you selected so Voyagio can make your itinerary
        feel much more like you.
      </p>
    </div>

    <!-- FOOD -->
    <section
      v-if="hasInterest('Food')"
      class="interest-section"
    >
      <div class="interest-heading">
        <div>
          <p class="interest-label">
            FOOD
          </p>

          <h3>
            Let's talk about food
          </h3>
        </div>
      </div>

      <div class="preference-group">
        <h4>
          What cuisines do you enjoy?
        </h4>

        <div class="option-grid">
          <button
            v-for="item in options.food.cuisines"
            :key="item"
            type="button"
            class="option-chip"
            :class="{ selected: formData.food.cuisines.includes(item) }"
            @click="toggleArrayValue(formData.food.cuisines, item)"
          >
            <span v-if="formData.food.cuisines.includes(item)">
              ✓
            </span>

            {{ item }}
          </button>
        </div>
      </div>

      <div class="preference-group">
        <h4>
          What kind of food places do you prefer?
        </h4>

        <div class="option-grid">
          <button
            v-for="item in options.food.places"
            :key="item"
            type="button"
            class="option-chip"
            :class="{ selected: formData.food.places.includes(item) }"
            @click="toggleArrayValue(formData.food.places, item)"
          >
            <span v-if="formData.food.places.includes(item)">
              ✓
            </span>

            {{ item }}
          </button>
        </div>
      </div>

      <div class="preference-group">
        <h4>
          How much do you usually want to spend on food?
        </h4>

        <div class="radio-grid">
          <label
            v-for="item in options.food.spending"
            :key="item"
            class="radio-card"
            :class="{ selected: formData.food.spending === item }"
          >
            <input
              v-model="formData.food.spending"
              type="radio"
              name="food-spending"
              :value="item"
            >

            <span>
              {{ item }}
            </span>
          </label>
        </div>
      </div>
    </section>


    <!-- NIGHTLIFE -->
    <section
      v-if="hasInterest('Nightlife')"
      class="interest-section"
    >
      <div class="interest-heading">
        <div>
          <p class="interest-label">
            NIGHTLIFE
          </p>

          <h3>
            What does a good night out look like?
          </h3>
        </div>
      </div>

      <div class="preference-group">
        <h4>
          What kind of nightlife do you enjoy?
        </h4>

        <div class="option-grid">
          <button
            v-for="item in options.nightlife.types"
            :key="item"
            type="button"
            class="option-chip"
            :class="{ selected: formData.nightlife.types.includes(item) }"
            @click="toggleArrayValue(formData.nightlife.types, item)"
          >
            <span v-if="formData.nightlife.types.includes(item)">
              ✓
            </span>

            {{ item }}
          </button>
        </div>
      </div>

      <div
        v-if="hasClubs"
        class="preference-group nested-group"
      >
        <h4>
          What music do you prefer?
        </h4>

        <div class="option-grid">
          <button
            v-for="item in options.nightlife.music"
            :key="item"
            type="button"
            class="option-chip"
            :class="{ selected: formData.nightlife.music.includes(item) }"
            @click="toggleArrayValue(formData.nightlife.music, item)"
          >
            <span v-if="formData.nightlife.music.includes(item)">
              ✓
            </span>

            {{ item }}
          </button>
        </div>
      </div>
    </section>


    <!-- CULTURE -->
    <section
      v-if="hasInterest('Culture')"
      class="interest-section"
    >
      <div class="interest-heading">
        <div>
          <p class="interest-label">
            CULTURE
          </p>

          <h3>
            What draws you into a place?
          </h3>
        </div>
      </div>

      <div class="preference-group">
        <h4>
          What interests you?
        </h4>

        <div class="option-grid">
          <button
            v-for="item in options.culture.types"
            :key="item"
            type="button"
            class="option-chip"
            :class="{ selected: formData.culture.types.includes(item) }"
            @click="toggleArrayValue(formData.culture.types, item)"
          >
            <span v-if="formData.culture.types.includes(item)">
              ✓
            </span>

            {{ item }}
          </button>
        </div>
      </div>

      <div class="preference-group">
        <h4>
          How much culture do you want in your itinerary?
        </h4>

        <div class="radio-grid">
          <label
            v-for="item in options.culture.amount"
            :key="item"
            class="radio-card"
            :class="{ selected: formData.culture.amount === item }"
          >
            <input
              v-model="formData.culture.amount"
              type="radio"
              name="culture-amount"
              :value="item"
            >

            <span>
              {{ item }}
            </span>
          </label>
        </div>
      </div>
    </section>


    <!-- NATURE -->
    <section
      v-if="hasInterest('Nature')"
      class="interest-section"
    >
      <div class="interest-heading">
        <div>
          <p class="interest-label">
            NATURE
          </p>

          <h3>
            What kind of nature do you want around you?
          </h3>
        </div>
      </div>

      <div class="preference-group">
        <h4>
          What do you enjoy?
        </h4>

        <div class="option-grid">
          <button
            v-for="item in options.nature.types"
            :key="item"
            type="button"
            class="option-chip"
            :class="{ selected: formData.nature.types.includes(item) }"
            @click="toggleArrayValue(formData.nature.types, item)"
          >
            <span v-if="formData.nature.types.includes(item)">
              ✓
            </span>

            {{ item }}
          </button>
        </div>
      </div>

      <div
        v-if="hasHiking"
        class="preference-group nested-group"
      >
        <h4>
          Preferred hiking difficulty
        </h4>

        <div class="radio-grid">
          <label
            v-for="item in options.nature.hikingDifficulty"
            :key="item"
            class="radio-card"
            :class="{ selected: formData.nature.hikingDifficulty === item }"
          >
            <input
              v-model="formData.nature.hikingDifficulty"
              type="radio"
              name="hiking-difficulty"
              :value="item"
            >

            <span>
              {{ item }}
            </span>
          </label>
        </div>
      </div>
    </section>


    <!-- BEACHES -->
    <section
      v-if="hasInterest('Beaches')"
      class="interest-section"
    >
      <div class="interest-heading">
        <div>
          <p class="interest-label">
            BEACHES
          </p>

          <h3>
            What's your ideal beach day?
          </h3>
        </div>
      </div>

      <div class="preference-group">
        <h4>
          What kind of beaches do you prefer?
        </h4>

        <div class="option-grid">
          <button
            v-for="item in options.beaches.types"
            :key="item"
            type="button"
            class="option-chip"
            :class="{ selected: formData.beaches.types.includes(item) }"
            @click="toggleArrayValue(formData.beaches.types, item)"
          >
            <span v-if="formData.beaches.types.includes(item)">
              ✓
            </span>

            {{ item }}
          </button>
        </div>
      </div>

      <div class="preference-group">
        <h4>
          How much beach time do you want?
        </h4>

        <div class="radio-grid">
          <label
            v-for="item in options.beaches.time"
            :key="item"
            class="radio-card"
            :class="{ selected: formData.beaches.time === item }"
          >
            <input
              v-model="formData.beaches.time"
              type="radio"
              name="beach-time"
              :value="item"
            >

            <span>
              {{ item }}
            </span>
          </label>
        </div>
      </div>
    </section>


    <!-- RELAXATION -->
    <section
      v-if="hasInterest('Relaxation')"
      class="interest-section"
    >
      <div class="interest-heading">
        <div>
          <p class="interest-label">
            RELAXATION
          </p>

          <h3>
            How do you like to slow down?
          </h3>
        </div>
      </div>

      <div class="preference-group">
        <h4>
          What helps you relax?
        </h4>

        <div class="option-grid">
          <button
            v-for="item in options.relaxation.types"
            :key="item"
            type="button"
            class="option-chip"
            :class="{ selected: formData.relaxation.types.includes(item) }"
            @click="toggleArrayValue(formData.relaxation.types, item)"
          >
            <span v-if="formData.relaxation.types.includes(item)">
              ✓
            </span>

            {{ item }}
          </button>
        </div>
      </div>

      <div class="preference-group">
        <h4>
          How much downtime do you want?
        </h4>

        <div class="radio-grid">
          <label
            v-for="item in options.relaxation.downtime"
            :key="item"
            class="radio-card"
            :class="{ selected: formData.relaxation.downtime === item }"
          >
            <input
              v-model="formData.relaxation.downtime"
              type="radio"
              name="relaxation-downtime"
              :value="item"
            >

            <span>
              {{ item }}
            </span>
          </label>
        </div>
      </div>
    </section>


    <!-- SHOPPING -->
    <section
      v-if="hasInterest('Shopping')"
      class="interest-section"
    >
      <div class="interest-heading">
        <div>
          <p class="interest-label">
            SHOPPING
          </p>

          <h3>
            What kind of shopping do you enjoy?
          </h3>
        </div>
      </div>

      <div class="preference-group">
        <div class="option-grid">
          <button
            v-for="item in options.shopping"
            :key="item"
            type="button"
            class="option-chip"
            :class="{ selected: formData.shopping.types.includes(item) }"
            @click="toggleArrayValue(formData.shopping.types, item)"
          >
            <span v-if="formData.shopping.types.includes(item)">
              ✓
            </span>

            {{ item }}
          </button>
        </div>
      </div>
    </section>


    <!-- ADVENTURE -->
    <section
      v-if="hasInterest('Adventure')"
      class="interest-section"
    >
      <div class="interest-heading">
        <div>
          <p class="interest-label">
            ADVENTURE
          </p>

          <h3>
            How adventurous are we feeling?
          </h3>
        </div>
      </div>

      <div class="preference-group">
        <h4>
          What sounds fun?
        </h4>

        <div class="option-grid">
          <button
            v-for="item in options.adventure.types"
            :key="item"
            type="button"
            class="option-chip"
            :class="{ selected: formData.adventure.types.includes(item) }"
            @click="toggleArrayValue(formData.adventure.types, item)"
          >
            <span v-if="formData.adventure.types.includes(item)">
              ✓
            </span>

            {{ item }}
          </button>
        </div>
      </div>

      <div class="preference-group">
        <h4>
          What's your adventure level?
        </h4>

        <div class="radio-grid">
          <label
            v-for="item in options.adventure.intensity"
            :key="item"
            class="radio-card"
            :class="{ selected: formData.adventure.intensity === item }"
          >
            <input
              v-model="formData.adventure.intensity"
              type="radio"
              name="adventure-intensity"
              :value="item"
            >

            <span>
              {{ item }}
            </span>
          </label>
        </div>
      </div>
    </section>


    <!-- ENTERTAINMENT -->
    <section
      v-if="hasInterest('Entertainment')"
      class="interest-section"
    >
      <div class="interest-heading">
        <div>
          <p class="interest-label">
            ENTERTAINMENT
          </p>

          <h3>
            What sounds entertaining?
          </h3>
        </div>
      </div>

      <div class="preference-group">
        <div class="option-grid">
          <button
            v-for="item in options.entertainment"
            :key="item"
            type="button"
            class="option-chip"
            :class="{ selected: formData.entertainment.types.includes(item) }"
            @click="toggleArrayValue(formData.entertainment.types, item)"
          >
            <span v-if="formData.entertainment.types.includes(item)">
              ✓
            </span>

            {{ item }}
          </button>
        </div>
      </div>
    </section>


    <!-- PHOTOGRAPHY -->
    <section
      v-if="hasInterest('Photography')"
      class="interest-section"
    >
      <div class="interest-heading">
        <div>
          <p class="interest-label">
            PHOTOGRAPHY
          </p>

          <h3>
            What do you love photographing?
          </h3>
        </div>
      </div>

      <div class="preference-group">
        <div class="option-grid">
          <button
            v-for="item in options.photography"
            :key="item"
            type="button"
            class="option-chip"
            :class="{ selected: formData.photography.types.includes(item) }"
            @click="toggleArrayValue(formData.photography.types, item)"
          >
            <span v-if="formData.photography.types.includes(item)">
              ✓
            </span>

            {{ item }}
          </button>
        </div>
      </div>
    </section>


    <!-- TOP PRIORITIES -->
    <section
      v-if="selectedInterests.length > 3"
      class="priority-section"
    >
      <div class="priority-heading">
        <p class="priority-kicker">
          MOST IMPORTANT
        </p>

        <h3>
          What matters most to you?
        </h3>

        <p>
          Choose up to 3 priorities. Voyagio will give these more weight when
          building your itinerary.
        </p>
      </div>

      <div class="priority-grid">
        <button
          v-for="interest in selectedInterests"
          :key="interest"
          type="button"
          class="priority-card"
          :class="{ selected: formData.topPriorities.includes(interest) }"
          @click="togglePriority(interest)"
        >
          <span class="priority-star">
            {{ formData.topPriorities.includes(interest) ? '★' : '☆' }}
          </span>

          <span>
            {{ interest }}
          </span>
        </button>
      </div>

      <p class="priority-count">
        {{ formData.topPriorities.length }} / 3 selected
      </p>
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
        Next: Your stay
        <span aria-hidden="true">
          →
        </span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.interests-step {
  width: 100%;
}


/* =========================
   INTEREST SECTIONS
========================= */

.interest-section {
  padding: 38px 0;

  border-top: 1px solid rgba(84, 107, 65, 0.12);
}

.interest-heading {
  margin-bottom: 28px;
}

.interest-label {
  margin: 0 0 8px;

  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.16em;

  color: var(--color-accent);
}

.interest-heading h3 {
  margin: 0;

  font-family: var(--font-heading);
  font-size: 28px;
  font-weight: 600;

  color: var(--color-text);
}


/* =========================
   PREFERENCE GROUPS
========================= */

.preference-group + .preference-group {
  margin-top: 32px;
}

.preference-group h4 {
  margin: 0 0 15px;

  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 700;

  color: #3e493b;
}

.nested-group {
  padding: 24px;

  border-radius: 12px;

  background: rgba(153, 173, 122, 0.09);
}


/* =========================
   RADIO GRID
========================= */

.radio-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));

  gap: 10px;
}


/* =========================
   PRIORITIES
========================= */

.priority-section {
  margin-top: 28px;

  padding: 34px;

  border-radius: var(--border-radius-large);

  background: var(--color-sand);
}

.priority-kicker {
  margin: 0 0 8px;

  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 700;

  letter-spacing: 0.16em;

  color: var(--color-primary);
}

.priority-heading h3 {
  margin: 0;

  font-family: var(--font-heading);
  font-size: 28px;
  font-weight: 600;

  color: var(--color-text);
}

.priority-heading > p:last-child {
  max-width: 650px;

  margin: 10px 0 0;

  font-family: var(--font-body);
  font-size: 14px;
  line-height: 1.6;

  color: #576151;
}

.priority-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  gap: 10px;

  margin-top: 24px;
}

.priority-card {
  min-height: 58px;

  display: flex;
  align-items: center;

  gap: 10px;

  padding: 0 16px;

  border: 1px solid rgba(84, 107, 65, 0.22);
  border-radius: var(--border-radius-small);

  background: rgba(255, 248, 236, 0.66);

  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 700;

  color: #3e493b;

  cursor: pointer;

  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.priority-card:hover {
  transform: translateY(-1px);

  border-color: rgba(84, 107, 65, 0.5);
}

.priority-card.selected {
  border-color: var(--color-primary);

  background: var(--color-primary);
  color: var(--color-background);
}

.priority-star {
  font-size: 17px;
}

.priority-count {
  margin: 14px 0 0;

  text-align: right;

  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 700;

  color: #687261;
}


/* =========================
   NAVIGATION SPACING
========================= */

.step-actions {
  margin-top: 38px;
}


/* =========================
   TABLET
========================= */

@media (max-width: 900px) {
  .radio-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .priority-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}


/* =========================
   MOBILE
========================= */

@media (max-width: 600px) {
  .interest-section {
    padding: 30px 0;
  }

  .interest-heading h3 {
    font-size: 24px;
  }

  .radio-grid,
  .priority-grid {
    grid-template-columns: 1fr;
  }

  .nested-group {
    padding: 18px;
  }

  .priority-section {
    padding: 24px 20px;
  }
}
</style>