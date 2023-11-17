<script setup lang="ts">
import { useLoyaltyStore } from '@/stores/LoyaltyStore'
import { useCardStore } from '@/stores/CardStore'
import { useUserStore } from '@/stores/UserStore'
import { useRoute } from 'vue-router'
import { useFilters } from '@/composables/useFilters'
import BaseCard from '@/components/BaseCard.vue'
import BaseListItem from '@/components/BaseListItem.vue'
import BaseFilters from '@/components/BaseFilters.vue'

const loyaltyStore = useLoyaltyStore()
const cardStore = useCardStore()
const userStore = useUserStore()
const route = useRoute()

const { filters, selectedFilters } = useFilters(route.params.id as string)

loyaltyStore.fetchLoyalties({ id: route.params.id as string, filters: selectedFilters.value })

const upsertLoyalty = async (item: any) => {
  if (item.count === cardStore.card?.maxCount - 1) {
    loyaltyStore.upsertLoyalty(item.id, {
      count: item.count + 1,
      canBeRedeem: true,
      active: false
    })
    const newLoyalty = await loyaltyStore.createLoyalty({
      userId: item.userId,
      cardId: item.cardId
    })

    // update card loyalties
    cardStore.upsertCard(cardStore.card?.id, {
      ...cardStore.card,
      loyalties: [...cardStore.card.loyalties, newLoyalty?.id]
    })
    // update user loyalties
    const user = userStore.users.find((user: any) => user.id === item.userId)
    userStore.upsertUser(item.userId, {
      ...user,
      loyalties: [...user.loyalties, newLoyalty?.id]
    })
    // refresh data
    loyaltyStore.fetchLoyalties({ id: route.params.id as string, filters: selectedFilters.value })
  } else {
    loyaltyStore.upsertLoyalty(item.id, {
      count: item.count + 1
    })
  }
}

const redeemLoyalty = async (item: any) => {
  loyaltyStore.upsertLoyalty(item.id, {
    canBeRedeem: false,
    redeem: true
  })
}

const userDetails = (id: string) => {
  return userStore.users.find((user: any) => user.id === id)
}
</script>

<template>
  <VContainer>
    <BaseFilters v-model="selectedFilters" :items="filters" />
    <div class="flex flex-wrap gap-4">
      <v-list class="grow">
        <BaseListItem
          v-for="loyalty in loyaltyStore.loyalties"
          :key="loyalty.id"
          :loyalty="loyalty"
          :user="userDetails(loyalty.userId)"
          :card="cardStore.card"
          @stamp="upsertLoyalty(loyalty)"
          @redeem="redeemLoyalty(loyalty)"
        />
      </v-list>
      <BaseCard v-if="cardStore.card" :card="cardStore.card" />
    </div>
  </VContainer>
</template>
