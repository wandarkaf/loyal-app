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
  { id: 3, name: 'Contact', to: '/contact', icon: 'mdi-email' }
])
</script>
<template>
  <v-navigation-drawer :modelValue="modelValue" temporary>
    <v-list>
      <VListItem
        v-for="route in routes"
        :key="route.id"
        :to="route.to"
        @click="$emit('update:modelValue', !modelValue)"
      >
        <template #prepend>
          <v-icon>{{ route.icon }}</v-icon>
        </template>
        {{ route.name }}
      </VListItem>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped></style>
