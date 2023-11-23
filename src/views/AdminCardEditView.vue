<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useCardStore } from '@/stores/CardStore'
import { useNotifications } from '@/composables/useNotifications'

import CardForm from '@/components/CardForm.vue'

const route = useRoute()
const cardStore = useCardStore()
const { addNotification } = useNotifications()

cardStore.fetchCard(route.params.id as string)

const updateCard = (card: any) => {
  cardStore.upsertCard(route.params.id as string, card)
  addNotification({
    message: 'Card updated',
    timeout: 5000
  })
}
</script>
<template>
  <VContainer>
    <CardForm :card="cardStore.card" @submit="updateCard">Update Card</CardForm>
  </VContainer>
</template>

<style scoped></style>
