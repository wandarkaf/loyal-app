<script setup lang="ts">
defineProps({
  card: {
    type: Object,
    required: true
  }
})
</script>
<template>
  <div :style="card.style" class="w-1/3 h-64 rounded shadow p-2 flex flex-col">
    <h1>{{ card.name }}</h1>
    <div class="flex flex-wrap gap-4 content-center grow">
      <v-icon
        v-for="n in card.maxCount"
        :key="`${n}${card.id}`"
        :size="56"
        icon="mdi-coffee"
        :color="n <= card.count ? card.style.stampInactiveColor : card.style.stampActiveColor"
      ></v-icon>
    </div>
  </div>
</template>

<style scoped></style>
