<script setup lang="ts">
import { useAuthStore } from '@/stores/AuthStore'
import { useCardStore } from '@/stores/CardStore'

import BaseCard from '@/components/BaseCard.vue'
import { RouterLink } from 'vue-router'

const authStore = useAuthStore()
const cardStore = useCardStore()

cardStore.fetchCards(authStore.authUser?.cards || [])
</script>

<template>
  <VContainer>
    <div v-for="card in cardStore.cards" :key="card.id">
      <RouterLink :to="{ name: 'adminCard', params: { id: card.id } }">
        <BaseCard :card="{ ...card }" />
      </RouterLink>
    </div>
  </VContainer>
</template>

<style scoped></style>
