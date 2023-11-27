<script setup lang="ts">
import BaseParallax from '@/components/BaseParallax.vue'
import BaseCard from '@/components/BaseCard.vue'
import { useCardStore } from '@/stores/CardStore'
import { useAuthStore } from '@/stores/AuthStore'
import { computed } from 'vue'

const authStore = useAuthStore()
const cardStore = useCardStore()
cardStore.fetchAllCards()

const cards = computed(() =>
  cardStore.cards.map((card: any) => ({
    ...card,
    canAddLoyalty: !authStore.authUser?.cards.includes(card.id)
  }))
)
</script>

<template>
  <div>
    <BaseParallax src="https://cdn.vuetifyjs.com/images/parallax/material.jpg" height="500">
      <h2 class="mb-4 text-2xl">This will be a map</h2>
      <h4 class="">yup!</h4>
    </BaseParallax>
    <VContainer>
      <div class="grid-cols-3 grid gap-4">
        <BaseCard
          v-for="card in cards"
          :key="card.id"
          :card="card"
          :canAddLoyalty="card.canAddLoyalty"
          demo
        />
      </div>
    </VContainer>
  </div>
</template>

<style scoped></style>
