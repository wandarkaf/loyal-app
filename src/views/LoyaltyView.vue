<script setup lang="ts">
import BaseCard from '@/components/BaseCard.vue'

import { useAuthStore } from '@/stores/AuthStore'
import { useLoyaltyStore } from '@/stores/LoyaltyStore'
import { useCardStore } from '@/stores/CardStore'
// import { useUserStore } from '@/stores/UserStore'

const authStore = useAuthStore()
const loyaltyStore = useLoyaltyStore()
const cardStore = useCardStore()
// const userStore = useUserStore()

loyaltyStore.fetchLoyalties(authStore.authUser?.loyalties || [])
cardStore.fetchCards(authStore.authUser?.cards || [])
</script>
<template>
  <VContainer>
    <!-- {{ authStore.authUser?.loyalties }} -->
    <div class="flex gap-4 flex-wrap">
      <BaseCard
        v-for="loyalty in loyaltyStore.loyalties"
        :key="loyalty.id"
        :card="{
          ...cardStore.cards.find((card: any) => card.id === loyalty.cardId),
          count: loyalty.stamps
        }"
        :loyalty="loyalty"
      />
    </div>
  </VContainer>
</template>

<style scoped></style>
