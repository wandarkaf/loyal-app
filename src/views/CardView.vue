<script setup lang="ts">
import { useCardStore } from '@/stores/CardStore'

const cardStore = useCardStore()
cardStore.fetchCards()
</script>

<template>
  <VContainer>
    <div class="flex gap-4">
      <div
        v-for="card in cardStore.cards"
        :key="card.id"
        :style="card.style"
        class="w-1/3 h-64 rounded shadow p-2 flex flex-col"
      >
        <h1>{{ card.name }}</h1>
        <div class="flex flex-wrap gap-4 content-center grow">
          <v-icon
            v-for="n in card.maxCount"
            :key="`${n}${card.id}`"
            :size="56"
            icon="mdi-coffee"
            :color="card.style.stampInactiveColor"
          ></v-icon>
        </div>
      </div>
    </div>
  </VContainer>
</template>

<style scoped></style>
