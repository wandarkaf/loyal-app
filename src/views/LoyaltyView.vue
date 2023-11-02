<script setup lang="ts">
import BaseCard from '@/components/BaseCard.vue'

import { useAuthStore } from '@/stores/AuthStore'
import { useLoyatyStore } from '@/stores/LoyaltyStore'
import { useCardStore } from '@/stores/CardStore'

const authStore = useAuthStore()
const loyaltyStore = useLoyatyStore()
const cardStore = useCardStore()

loyaltyStore.fetchLoyalties(authStore.authUser?.uid || '')
cardStore.fetchAllCards()
</script>
<template>
  <VContainer>
    {{ loyaltyStore.loyalties }}
    <div v-for="loyalty in loyaltyStore.loyalties" :key="loyalty.id">
      <div class="flex gap-4">
        <BaseCard
          :card="{
            ...cardStore.cards.find((card) => card.id === loyalty.cardId),
            count: loyalty.stamps
          }"
        />
      </div>
    </div>
  </VContainer>
</template>

<style scoped></style>
