<script setup lang="ts">
import BaseCard from '@/components/BaseCard.vue'

import { useAuthStore } from '@/stores/AuthStore'
import { useLoyaltyStore } from '@/stores/LoyaltyStore'
import { useCardStore } from '@/stores/CardStore'

const authStore = useAuthStore()
const loyaltyStore = useLoyaltyStore()
const cardStore = useCardStore()

loyaltyStore.fetchLoyaltiesByUserId(authStore.authUser?.uid || '')
cardStore.fetchCardsByUserId(authStore.authUser?.uid || '')
</script>
<template>
  {{ authStore.authUser }}
  <VContainer>
    <div v-for="loyalty in loyaltyStore.loyalties" :key="loyalty.id">
      <div class="flex gap-4">
        <BaseCard
          :card="{
            ...cardStore.cards.find((card: any) => card.id === loyalty.cardId),
            count: loyalty.stamps
          }"
        />
      </div>
    </div>
  </VContainer>
</template>

<style scoped></style>
