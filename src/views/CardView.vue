<script setup lang="ts">
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
  <div class="grid gap-4 grid-cols-3">
    <div class="lg:grid-cols-3 md:grid-cols-2 grid gap-4 p-4 col-span-2">
      <BaseCard
        v-for="card in cards"
        :key="card.id"
        :card="card"
        :canAddLoyalty="card.canAddLoyalty"
        demo
      />
    </div>
    <div class="bg-red-500"></div>
  </div>
</template>

<style scoped></style>
