<script setup lang="ts">
import { useAuthStore } from '@/stores/AuthStore'
import { useLoyaltyStore } from '@/stores/LoyaltyStore'
import { useCardStore } from '@/stores/CardStore'
import { useFilters } from '@/composables/useFilters'

import BaseCard from '@/components/BaseCard.vue'
import BaseFilters from '@/components/BaseFilters.vue'

const authStore = useAuthStore()
const loyaltyStore = useLoyaltyStore()
const cardStore = useCardStore()

const { filters, selectedFilters } = useFilters(authStore.authUser?.uid as string, 'userId')

selectedFilters.value = ['active']

loyaltyStore.fetchLoyalties({
  id: authStore.authUser?.uid as string,
  filters: selectedFilters.value,
  type: 'userId'
})
cardStore.fetchCards(authStore.authUser?.cards || [])
</script>
<template>
  <VContainer>
    <BaseFilters v-model="selectedFilters" :items="filters" />

    <div class="flex gap-4 flex-col items-center">
      <BaseCard
        v-for="loyalty in loyaltyStore.loyalties"
        :key="loyalty.id"
        :card="{
          ...cardStore.cards.find((card: any) => card.id === loyalty.cardId)
        }"
        :loyalty="loyalty"
      />
    </div>
  </VContainer>
</template>

<style scoped></style>
