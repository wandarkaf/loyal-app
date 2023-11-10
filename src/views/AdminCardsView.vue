<script setup lang="ts">
import { useAuthStore } from '@/stores/AuthStore'
import { useCardStore } from '@/stores/CardStore'

import BaseCard from '@/components/BaseCard.vue'
import { RouterLink } from 'vue-router'

const authStore = useAuthStore()
const cardStore = useCardStore()

cardStore.fetchCardsByUserId(authStore.authUser?.uid || '')
</script>

<template>
  <VContainer>
    <div v-for="card in cardStore.cards" :key="card.id">
      <RouterLink :to="{ name: 'adminCard', params: { id: card.id } }">
        <BaseCard :card="{ ...card, count: 0 }" />
      </RouterLink>
    </div>
  </VContainer>
</template>

<style scoped></style>
