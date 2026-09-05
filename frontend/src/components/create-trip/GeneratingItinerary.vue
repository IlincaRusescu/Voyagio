<template>
  <div class="generation-overlay">
    <div class="generation-content">
      <p class="step-kicker">
        BUILDING YOUR TRIP
      </p>

      <h1>Your itinerary is taking shape</h1>

      <div class="generation-status">
        <p class="status-text">
          {{ message }}
        </p>

        <div
          v-if="!complete"
          class="loading-track"
        >
          <div class="loading-bar"></div>
        </div>

        <div
          v-else
          class="complete-mark"
        >
          ✓
        </div>
      </div>

      <p
        v-if="!complete"
        class="generation-hint"
      >
        This can take a little while. We're putting the pieces together.
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    required: true
  },

  complete: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.generation-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: var(--color-background);
}

.generation-content {
  width: min(560px, 100%);
  text-align: center;
}

.generation-content h1 {
  margin: 10px 0 36px;
}

.generation-status {
  padding: 32px;
  border: 1px solid var(--color-sand);
  border-radius: var(--radius-large);
}

.status-text {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
}

.loading-track {
  position: relative;
  height: 4px;
  margin-top: 24px;
  overflow: hidden;
  border-radius: 999px;
  background: var(--color-sand);
}

.loading-bar {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 35%;
  border-radius: 999px;
  background: var(--color-primary);
  animation: loading 1.3s ease-in-out infinite;
}

.complete-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  margin: 24px auto 0;
  border-radius: 50%;
  background: var(--color-primary);
  color: var(--color-background);
  font-size: 1.4rem;
}

.generation-hint {
  margin-top: 20px;
  color: var(--color-primary);
  opacity: 0.75;
}

@keyframes loading {
  0% {
    left: -35%;
  }

  100% {
    left: 100%;
  }
}
</style>