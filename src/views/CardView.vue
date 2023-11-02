<script setup lang="ts">
import BaseCard from '@/components/BaseCard.vue'
import { useCardStore } from '@/stores/CardStore'

const cardStore = useCardStore()
cardStore.fetchAllCards()
</script>

<template>
  <VContainer>
    <div class="flex gap-4">
      <BaseCard v-for="card in cardStore.cards" :key="card.id" :card="card" />
    </div>
  </VContainer>
</template>

<style scoped></style>
