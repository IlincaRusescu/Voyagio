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
  <section>
    <p>Step 2 of 6</p>

    <h1>Tell us what you love</h1>

    <p>
      We'll use your preferences to personalize your itinerary.
    </p>

    <!-- FOOD -->
    <div v-if="hasInterest('Food')">
      <h2>Food</h2>

      <h3>What cuisines do you enjoy?</h3>

      <button
        v-for="item in options.food.cuisines"
        :key="item"
        type="button"
        @click="toggleArrayValue(formData.food.cuisines, item)"
      >
        {{ formData.food.cuisines.includes(item) ? '✓ ' : '' }}
        {{ item }}
      </button>

      <h3>What kind of food places do you prefer?</h3>

      <button
        v-for="item in options.food.places"
        :key="item"
        type="button"
        @click="toggleArrayValue(formData.food.places, item)"
      >
        {{ formData.food.places.includes(item) ? '✓ ' : '' }}
        {{ item }}
      </button>

      <h3>How much do you usually want to spend on food?</h3>

      <label
        v-for="item in options.food.spending"
        :key="item"
      >
        <input
          v-model="formData.food.spending"
          type="radio"
          name="food-spending"
          :value="item"
        >

        {{ item }}
      </label>
    </div>

    <!-- NIGHTLIFE -->
    <div v-if="hasInterest('Nightlife')">
      <h2>Nightlife</h2>

      <h3>What kind of nightlife do you enjoy?</h3>

      <button
        v-for="item in options.nightlife.types"
        :key="item"
        type="button"
        @click="toggleArrayValue(formData.nightlife.types, item)"
      >
        {{ formData.nightlife.types.includes(item) ? '✓ ' : '' }}
        {{ item }}
      </button>

      <div v-if="hasClubs">
        <h3>What music do you prefer?</h3>

        <button
          v-for="item in options.nightlife.music"
          :key="item"
          type="button"
          @click="toggleArrayValue(formData.nightlife.music, item)"
        >
          {{ formData.nightlife.music.includes(item) ? '✓ ' : '' }}
          {{ item }}
        </button>
      </div>
    </div>

    <!-- CULTURE -->
    <div v-if="hasInterest('Culture')">
      <h2>Culture</h2>

      <h3>What interests you?</h3>

      <button
        v-for="item in options.culture.types"
        :key="item"
        type="button"
        @click="toggleArrayValue(formData.culture.types, item)"
      >
        {{ formData.culture.types.includes(item) ? '✓ ' : '' }}
        {{ item }}
      </button>

      <h3>How much culture do you want in your itinerary?</h3>

      <label
        v-for="item in options.culture.amount"
        :key="item"
      >
        <input
          v-model="formData.culture.amount"
          type="radio"
          name="culture-amount"
          :value="item"
        >

        {{ item }}
      </label>
    </div>

    <!-- NATURE -->
    <div v-if="hasInterest('Nature')">
      <h2>Nature</h2>

      <h3>What do you enjoy?</h3>

      <button
        v-for="item in options.nature.types"
        :key="item"
        type="button"
        @click="toggleArrayValue(formData.nature.types, item)"
      >
        {{ formData.nature.types.includes(item) ? '✓ ' : '' }}
        {{ item }}
      </button>

      <div v-if="hasHiking">
        <h3>Preferred hiking difficulty</h3>

        <label
          v-for="item in options.nature.hikingDifficulty"
          :key="item"
        >
          <input
            v-model="formData.nature.hikingDifficulty"
            type="radio"
            name="hiking-difficulty"
            :value="item"
          >

          {{ item }}
        </label>
      </div>
    </div>

    <!-- BEACHES -->
    <div v-if="hasInterest('Beaches')">
      <h2>Beaches</h2>

      <h3>What kind of beaches do you prefer?</h3>

      <button
        v-for="item in options.beaches.types"
        :key="item"
        type="button"
        @click="toggleArrayValue(formData.beaches.types, item)"
      >
        {{ formData.beaches.types.includes(item) ? '✓ ' : '' }}
        {{ item }}
      </button>

      <h3>How much beach time do you want?</h3>

      <label
        v-for="item in options.beaches.time"
        :key="item"
      >
        <input
          v-model="formData.beaches.time"
          type="radio"
          name="beach-time"
          :value="item"
        >

        {{ item }}
      </label>
    </div>

    <!-- RELAXATION -->
    <div v-if="hasInterest('Relaxation')">
      <h2>Relaxation</h2>

      <h3>What helps you relax?</h3>

      <button
        v-for="item in options.relaxation.types"
        :key="item"
        type="button"
        @click="toggleArrayValue(formData.relaxation.types, item)"
      >
        {{ formData.relaxation.types.includes(item) ? '✓ ' : '' }}
        {{ item }}
      </button>

      <h3>How much downtime do you want?</h3>

      <label
        v-for="item in options.relaxation.downtime"
        :key="item"
      >
        <input
          v-model="formData.relaxation.downtime"
          type="radio"
          name="relaxation-downtime"
          :value="item"
        >

        {{ item }}
      </label>
    </div>

    <!-- SHOPPING -->
    <div v-if="hasInterest('Shopping')">
      <h2>Shopping</h2>

      <h3>What kind of shopping do you enjoy?</h3>

      <button
        v-for="item in options.shopping"
        :key="item"
        type="button"
        @click="toggleArrayValue(formData.shopping.types, item)"
      >
        {{ formData.shopping.types.includes(item) ? '✓ ' : '' }}
        {{ item }}
      </button>
    </div>

    <!-- ADVENTURE -->
    <div v-if="hasInterest('Adventure')">
      <h2>Adventure</h2>

      <h3>What sounds fun?</h3>

      <button
        v-for="item in options.adventure.types"
        :key="item"
        type="button"
        @click="toggleArrayValue(formData.adventure.types, item)"
      >
        {{ formData.adventure.types.includes(item) ? '✓ ' : '' }}
        {{ item }}
      </button>

      <h3>What's your adventure level?</h3>

      <label
        v-for="item in options.adventure.intensity"
        :key="item"
      >
        <input
          v-model="formData.adventure.intensity"
          type="radio"
          name="adventure-intensity"
          :value="item"
        >

        {{ item }}
      </label>
    </div>

    <!-- ENTERTAINMENT -->
    <div v-if="hasInterest('Entertainment')">
      <h2>Entertainment</h2>

      <h3>What are you interested in?</h3>

      <button
        v-for="item in options.entertainment"
        :key="item"
        type="button"
        @click="toggleArrayValue(formData.entertainment.types, item)"
      >
        {{ formData.entertainment.types.includes(item) ? '✓ ' : '' }}
        {{ item }}
      </button>
    </div>

    <!-- PHOTOGRAPHY -->
    <div v-if="hasInterest('Photography')">
      <h2>Photography</h2>

      <h3>What do you like photographing?</h3>

      <button
        v-for="item in options.photography"
        :key="item"
        type="button"
        @click="toggleArrayValue(formData.photography.types, item)"
      >
        {{ formData.photography.types.includes(item) ? '✓ ' : '' }}
        {{ item }}
      </button>
    </div>

    <!-- TOP PRIORITIES -->
    <div v-if="selectedInterests.length > 3">
      <h2>What matters most to you?</h2>

      <p>
        Choose up to 3 priorities for this trip.
      </p>

      <button
        v-for="interest in selectedInterests"
        :key="interest"
        type="button"
        @click="togglePriority(interest)"
      >
        {{ formData.topPriorities.includes(interest) ? '★ ' : '' }}
        {{ interest }}
      </button>
    </div>

    <!-- NAVIGATION -->
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