<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import { useCardStore } from '@/stores/CardStore'
import { useAuthStore } from '@/stores/AuthStore'
import { useDevicePermission } from '@/composables/useDevicePermission'
import { useGeolocation } from '@/composables/useGeolocation'
import BaseCard from '@/components/BaseCard.vue'
import BaseMap from '@/components/BaseMap.vue'

import type { coordinates } from '@/types'

const authStore = useAuthStore()
const cardStore = useCardStore()
const { geolocationAccess } = useDevicePermission()
const { coords } = useGeolocation()

const center = computed(() => {
  if (geolocationAccess.value === 'granted' && coords.value.latitude !== Infinity) {
    return {
      lat: coords.value.latitude,
      lng: coords.value.longitude
    }
  }
  if (geolocationAccess.value === 'denied') {
    return {
      lat: cards.value[0].location.lat,
      lng: cards.value[0].location.lng
    }
  }
  return {
    lat: 0,
    lng: 0
  }
})
const highlightCard = shallowRef({ id: 0 })

const cards = computed(() =>
  cardStore.cards.map((card: any) => ({
    ...card,
    canAddLoyalty: !authStore.authUser?.cards?.includes(card.id) || false
  }))
)

const showMap = computed(() => cards.value.length > 0 && center.value.lat !== 0)

const markers = computed(() =>
  cards.value.map((card: any) => ({
    lat: card.location.lat,
    lng: card.location.lng,
    ...(card.location.icon ? { icon: card.location.icon } : {})
  }))
)

const handleCoordsUpdate = (position: coordinates) => {
  highlightCard.value =
    cards.value.find(
      (card: any) => card.location.lat === position.lat && card.location.lng === position.lng
    ) || {}
}

watch([coords, geolocationAccess], async ([coords, geolocationAccess]) => {
  if (geolocationAccess === 'granted' && coords.latitude !== Infinity) {
    cardStore.fetchCardsByLocation({
      center: center.value as any
    })
  }
  if (geolocationAccess === 'denied') {
    cardStore.fetchAllCards()
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
        :highlight="highlightCard !== null && highlightCard.id === card.id"
        demo
      />
    </div>
  </div>
</template>

<style scoped></style>
