<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/AuthStore'

const authStore = useAuthStore()

defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])

const routes = computed(() => {
  const defaultRoutes = [
    { id: 1, name: 'Home', to: '/', icon: 'mdi-home' },
    { id: 2, name: 'About', to: '/about', icon: 'mdi-information' },
    { id: 3, name: 'Contact', to: '/contact', icon: 'mdi-email' },
    { id: 7, name: 'Cards', to: '/cards', icon: 'mdi-card-multiple' }
  ]
  const commerceRoleRoutes =
    authStore.authUser?.role === 'commerce'
      ? [{ id: 4, name: 'Admin', to: '/admin', icon: 'mdi-account-supervisor' }]
      : []

  const casualRoleRoutes =
    authStore.authUser?.role === 'casual'
      ? [{ id: 5, name: 'Loyalty', to: '/loyalties', icon: 'mdi-wallet-membership' }]
      : []

  return [...defaultRoutes, ...casualRoleRoutes, ...commerceRoleRoutes]
})
</script>
<template>
  <VNavigationDrawer :modelValue="modelValue" temporary>
    <VList>
      <VListItem
        v-for="route in routes"
        :key="route.id"
        :to="route.to"
        @click="$emit('update:modelValue', !modelValue)"
      >
        <template #prepend>
          <VIcon>{{ route.icon }}</VIcon>
        </template>
        {{ route.name }}
      </VListItem>
    </VList>
  </VNavigationDrawer>
</template>

<style scoped></style>
