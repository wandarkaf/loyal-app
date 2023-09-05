<script setup lang="ts">
import BaseThemeSwitch from './BaseThemeSwitch.vue'
import { shallowRef } from 'vue'

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
      <BaseThemeSwitch />
      <VMenu width="150">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon="mdi-dots-vertical"></v-btn>
        </template>
        <v-list>
          <v-list-item v-for="item in items" :key="item.id" :value="item.id">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </VMenu>
    </template>
  </v-app-bar>
</template>

<style scoped></style>
