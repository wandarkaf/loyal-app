<script setup lang="ts">
import { RouterView } from 'vue-router'
import { shallowRef } from 'vue'

// import TheSystemBar from './components/TheSystemBar.vue'
import TheAppBar from './components/TheAppBar.vue'
import TheNavigationDrawer from './components/TheNavigationDrawer.vue'
import TheControlBar from './components/TheControlBar.vue'
import TheFooter from './components/TheFooter.vue'
import BaseNotifications from './components/BaseNotifications.vue'

const drawer = shallowRef(false)
</script>

<template>
  <VApp class="relative">
    <!-- <TheSystemBar /> -->
    <TheAppBar v-model="drawer" />
    <TheNavigationDrawer v-model="drawer" />
    <VMain>
      <RouterView v-slot="{ Component }" :key="$route.path">
        <VFadeTransition leave-absolute>
          <component :is="Component" :key="$route.path"></component>
        </VFadeTransition>
      </RouterView>
    </VMain>
    <BaseNotifications />
    <TheFooter />
    <TheControlBar />
  </VApp>
</template>

<style scoped></style>
