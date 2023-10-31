<script setup lang="ts">
import { useLoyatyStore } from '@/stores/LoyaltyStore'
import { useAuthStore } from '@/stores/AuthStore'

const loyaltyStore = useLoyatyStore()
const authStore = useAuthStore()

loyaltyStore.fetchLoyalties(authStore.authUser?.uid || '')
</script>
<template>
  <VContainer>
    {{ loyaltyStore.loyalties }}
  </VContainer>
</template>

<style scoped></style>
