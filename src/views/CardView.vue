<script setup lang="ts">
import BaseCard from '@/components/BaseCard.vue'
import BaseMap from '@/components/BaseMap.vue'
import { useCardStore } from '@/stores/CardStore'
import { useAuthStore } from '@/stores/AuthStore'
import { computed, shallowRef, watch } from 'vue'

const authStore = useAuthStore()
const cardStore = useCardStore()
cardStore.fetchAllCards()

const cards = computed(() =>
  cardStore.cards.map((card: any) => ({
    ...card,
    canAddLoyalty: !authStore.authUser?.cards.includes(card.id)
  }))
)

const center = shallowRef({ lat: 0, lng: 0 })
const markers = computed(() =>
  cards.value.map((card: any) => ({
    lat: card.location.lat,
    lng: card.location.lng
  }))
)

const handlePinUpdate = (position: { lat: number; lng: number }) => {
  console.log(position)
  center.value = {
    ...position
  }
}

watch(cards, (cards: any) => {
  center.value = {
    lat: cards[0].location.lat,
    lng: cards[0].location.lng
  }
})
</script>

<template>
  <div class="grid lg:gap-4 lg:grid-cols-3 md:grid-cols-1 sm:grid-cols-1">
    <div class="min-h-96 lg:order-last">
      <BaseMap
        v-if="cards.length > 0"
        :center="center"
        :markers="markers"
        :mapProps="{ zoom: 15 }"
        :markerProps="{ clickable: true }"
        @handlePinUpdate="handlePinUpdate"
      />
    </div>
    <div class="lg:grid-cols-3 md:grid-cols-2 grid gap-4 p-4 col-span-2">
      <BaseCard
        v-for="card in cards"
        :key="card.id"
        :card="card"
        :canAddLoyalty="card.canAddLoyalty"
        demo
      />
    </div>
  </div>
</template>

<style scoped></style>
