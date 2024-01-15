<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import { useCardStore } from '@/stores/CardStore'
import { useAuthStore } from '@/stores/AuthStore'
import BaseCard from '@/components/BaseCard.vue'
import BaseMap from '@/components/BaseMap.vue'
import { useDevicePermission } from '@/composables/useDevicePermission'
import { useGeolocation } from '@/composables/useGeolocation'
import { h } from 'vue'

const authStore = useAuthStore()
const cardStore = useCardStore()
const { geolocationAccess } = useDevicePermission()
const { coords } = useGeolocation()

cardStore.fetchAllCards()

const cards = computed(() =>
  cardStore.cards.map((card: any) => ({
    ...card,
    canAddLoyalty: !authStore.authUser?.cards.includes(card.id)
  }))
)

const center = shallowRef({ lat: 0, lng: 0 })
const highlightCard = shallowRef(null)

const showMap = computed(() => cards.value.length > 0 && center.value.lat !== 0)

const markers = computed(() =>
  cards.value.map((card: any) => ({
    lat: card.location.lat,
    lng: card.location.lng,
    ...(card.location.icon ? { icon: card.location.icon } : {})
  }))
)

const handleCoordsUpdate = (position: { lat: number; lng: number }) => {
  center.value = {
    ...position
  }
  highlightCard.value =
    cards.value.find(
      (card: any) => card.location.lat === position.lat && card.location.lng === position.lng
    ) || null
}

watch(cards, (cards: any) => {
  console.log(cards)
  if (cards.length > 0) {
    if (geolocationAccess.value && coords.value.latitude !== Infinity) {
      center.value = {
        lat: coords.value.latitude,
        lng: coords.value.longitude
      }
    } else {
      center.value = {
        lat: cards[0].location.lat,
        lng: cards[0].location.lng
      }
    }
  }
})
</script>

<template>
  <div class="grid lg:gap-4 lg:grid-cols-3 md:grid-cols-1 sm:grid-cols-1">
    <div class="min-h-96 lg:order-last">
      <BaseMap
        v-if="showMap"
        :center="center"
        :markers="markers"
        :mapProps="{ zoom: 15 }"
        :markerProps="{ clickable: true }"
        @handleCoordsUpdate="handleCoordsUpdate"
      />
    </div>
    <div class="lg:grid-cols-3 md:grid-cols-2 grid gap-4 p-4 col-span-2">
      <BaseCard
        v-for="card in cards"
        :key="card.id"
        :card="card"
        :canAddLoyalty="card.canAddLoyalty"
        :highlight="highlightCard && highlightCard.id === card.id"
        demo
      />
    </div>
  </div>
</template>

<style scoped></style>
