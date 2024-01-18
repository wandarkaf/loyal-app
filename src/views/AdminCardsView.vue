<script setup lang="ts">
import { useAuthStore } from '@/stores/AuthStore'
import { useCardStore } from '@/stores/CardStore'

import BaseCard from '@/components/BaseCard.vue'
import { RouterLink } from 'vue-router'

const authStore = useAuthStore()
const cardStore = useCardStore()

cardStore.fetchCards(authStore.authUser?.cards?.map(String) || [])
</script>

<template>
  <VContainer>
    <div class="flex gap-4 flex-col items-center">
      <VBtn color="primary" :to="{ name: 'adminCardCreate' }">Create card</VBtn>
      <div v-for="card in cardStore.cards" :key="card.id" class="flex flex-wrap gap-4">
        <RouterLink :to="{ name: 'adminCard', params: { id: card.id } }">
          <BaseCard :card="{ ...card }" demo />
        </RouterLink>
        <div class="flex flex-col gap-6">
          <VBtn color="primary" :to="{ name: 'adminCard', params: { id: card.id } }">Details</VBtn>
          <VBtn color="primary" :to="{ name: 'adminCardEdit', params: { id: card.id } }">Edit</VBtn>
        </div>
      </div>
    </div>
  </VContainer>
</template>

<style scoped></style>
