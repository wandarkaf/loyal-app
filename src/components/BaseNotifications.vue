<script setup lang="ts">
import { useNotifications } from '@/composables/useNotifications'

const { notifications, removeNotification } = useNotifications()
</script>

<template>
  <div class="fixed right-4 bottom-0 z-[9999]">
    <v-scroll-x-reverse-transition group>
      <VAlert
        v-for="notification in notifications"
        :key="notification.id"
        :text="notification.message"
        closable
        class="mb-4"
        @click:close="removeNotification(notification.id)"
      />
    </v-scroll-x-reverse-transition>
  </div>
</template>

<style scoped></style>
