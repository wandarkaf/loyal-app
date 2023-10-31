<script setup lang="ts">
import BaseThemeSwitch from './BaseThemeSwitch.vue'
import { shallowRef } from 'vue'
import { useAuthStore } from '@/stores/AuthStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])

const items = shallowRef([
  { id: 1, title: 'Profile' },
  { id: 2, title: 'Settings' }
  // { id: 3, title: 'Logout' }
])

const signOutUser = () => {
  authStore.signOutUser()
  router.push('/')
}
</script>
<template>
  <v-app-bar>
    <v-app-bar-nav-icon @click="$emit('update:modelValue', !modelValue)"></v-app-bar-nav-icon>

    <v-app-bar-title>Companny Logo</v-app-bar-title>

    <template v-slot:append>
      <BaseThemeSwitch />
      <VMenu v-if="authStore.authUser" width="150">
        <template v-slot:activator="{ props }">
          <VBtn v-bind="props" append-icon="mdi-dots-vertical">
            <v-avatar>
              <v-img
                v-if="authStore.authUser.photoURL"
                :src="authStore.authUser.photoURL"
                alt="Profile picture"
              ></v-img>
              <v-icon v-else icon="mdi-account-circle"></v-icon>
            </v-avatar>
            {{ authStore.authUser?.displayName || authStore.authUser?.email }}
          </VBtn>
        </template>
        <VList>
          <VListItem v-for="item in items" :key="item.id" :value="item.id">
            <VListItemTitle>{{ item.title }}</VListItemTitle>
          </VListItem>
          <VListItem @click="signOutUser">
            <VListItemTitle>Logout</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <template v-else>
        <v-btn to="/signin"> Sign In </v-btn>
        <V-btn to="/register"> Register </V-btn>
      </template>
    </template>
  </v-app-bar>
</template>

<style scoped></style>
