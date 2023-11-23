<script setup lang="ts">
import BaseParallax from '@/components/BaseParallax.vue'
import BaseCard from '@/components/BaseCard.vue'
import { useCardStore } from '@/stores/CardStore'

const cardStore = useCardStore()
cardStore.fetchAllCards()
</script>

<template>
  <BaseParallax src="https://cdn.vuetifyjs.com/images/parallax/material.jpg" height="500">
    <h2 class="mb-4 text-2xl">This will be a map</h2>
    <h4 class="">yup!</h4>
  </BaseParallax>
  <VContainer>
    <div class="grid-cols-3 grid gap-4">
      <BaseCard v-for="card in cardStore.cards" :key="card.id" :card="card" demo />
    </div>
  </VContainer>
</template>

<style scoped></style>
