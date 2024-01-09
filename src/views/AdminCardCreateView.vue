<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCardStore } from '@/stores/CardStore'
import { useUserStore } from '@/stores/UserStore'
import { useAuthStore } from '@/stores/AuthStore'

import { useNotifications } from '@/composables/useNotifications'

import CardForm from '@/components/CardForm.vue'

const router = useRouter()
const cardStore = useCardStore()
const userStore = useUserStore()
const authStore = useAuthStore()
const { addNotification } = useNotifications()

const createCard = async (card: any) => {
  const cardResponse = await cardStore.createCard(card)
  await userStore.upsertUser(authStore.authUser?.uid, {
    cards: [...authStore.authUser.cards, cardResponse?.id]
  })
  // await useAuthStore().initAuthentication()
  addNotification({
    message: 'Card created',
    timeout: 5000
  })
  router.push({ name: 'adminCards' })
}
</script>
<template>
  <VContainer>
    <CardForm
      :card="{
        id: '',
        name: '',
        description: '',
        type: 'stamp',
        maxCount: 10,
        icon: 'mdi-coffee-outline',
        loyalties: [],
        users: []
      }"
      @submit="createCard"
      >Create card</CardForm
    >
  </VContainer>
</template>

<style scoped></style>
