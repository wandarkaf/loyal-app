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

const highlightCard = shallowRef({ id: 0 })

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

const cards = computed(() =>
  cardStore.cards.map((card: any) => ({
    ...card,
    canAddLoyalty: !authStore.authUser?.cards?.includes(card.id) || false
  }))
)

const markers = computed(() =>
  cards.value.map((card: any) => ({
    lat: card.location.lat,
    lng: card.location.lng,
    props: {
      clickable: true,
      ...(card.location.icon
        ? {
            icon: {
              url: card.location.icon,
              scaledSize:
                highlightCard.value.id === card.id
                  ? { width: 60, height: 60 }
                  : { width: 45, height: 45 }
            }
          }
        : {})
    }
  }))
)

const loading = computed(() => !(cards.value.length > 0 && center.value.lat !== 0))

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
  <div class="grid lg:gap-4 lg:grid-cols-3 md:grid-cols-1 sm:grid-cols-1 grid-cols-1">
    <div class="min-h-96 lg:order-last">
      <v-skeleton-loader v-if="loading" type="image@5"></v-skeleton-loader>
      <BaseMap
        v-else
        :center="center"
        :markers="markers"
        :mapProps="{ zoom: 15 }"
        @handleCoordsUpdate="handleCoordsUpdate"
      />
    </div>
    <div class="lg:grid-cols-3 md:grid-cols-2 grid gap-4 p-4 col-span-2">
      <template v-if="loading">
        <v-skeleton-loader v-for="i in 9" :key="i" type="card" class="border"></v-skeleton-loader>
      </template>

      <BaseCard
        v-else
        v-for="card in cards"
        :key="card.id"
        :card="card"
        :canAddLoyalty="card.canAddLoyalty"
        :highlight="highlightCard !== null && highlightCard.id === card.id"
        :loyalty="{ count: 2 }"
        demo
        @click="highlightCard = card"
      />
    </div>
  </div>
</template>

<style scoped></style>
