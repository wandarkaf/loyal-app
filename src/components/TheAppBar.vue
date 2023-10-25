<script setup lang="ts">
import BaseThemeSwitch from './BaseThemeSwitch.vue'
import { shallowRef } from 'vue'
import { useUserStore } from '@/stores/UserStore'

const userStore = useUserStore()

defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])

const items = shallowRef([
  { id: 1, title: 'Profile' },
  { id: 2, title: 'Settings' },
  { id: 3, title: 'Logout' }
])
</script>
<template>
  <v-app-bar>
    <v-app-bar-nav-icon @click="$emit('update:modelValue', !modelValue)"></v-app-bar-nav-icon>

    <v-app-bar-title>Companny Logo</v-app-bar-title>

    <template v-slot:append>
      <p>{{ userStore.authId }}</p>
      <BaseThemeSwitch />
      <VMenu width="150">
        <template v-slot:activator="{ props }">
          <VBtn v-bind="props" icon="mdi-dots-vertical"></VBtn>
        </template>
        <VList>
          <VListItem v-for="item in items" :key="item.id" :value="item.id">
            <VListItemTitle>{{ item.title }}</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
    </template>
  </v-app-bar>
</template>

<style scoped></style>
