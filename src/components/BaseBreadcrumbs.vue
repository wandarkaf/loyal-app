<script setup lang="ts">
import { shallowRef } from 'vue'

const items = shallowRef([
  {
    text: 'Dashboard',
    disabled: false,
    href: '/dashboard'
  },
  {
    text: 'Link',
    disabled: false,
    href: '/dashboard'
  },
  {
    text: 'Active',
    disabled: true,
    href: '/dashboard'
  }
])
</script>
<template>
  <!-- vuetify type are a nightmare -->
  <v-breadcrumbs :items="items" divider="-"></v-breadcrumbs>
</template>

<style scoped></style>
