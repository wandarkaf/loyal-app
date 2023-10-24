<script setup lang="ts">
import { shallowRef } from 'vue'

defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])

const routes = shallowRef([
  { id: 1, name: 'Home', to: '/', icon: 'mdi-home' },
  { id: 2, name: 'About', to: '/about', icon: 'mdi-information' },
  { id: 3, name: 'Contact', to: '/contact', icon: 'mdi-email' },
  { id: 4, name: 'Admin', to: '/admin', icon: 'mdi-account-supervisor' }
])
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
