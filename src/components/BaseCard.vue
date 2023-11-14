<script setup lang="ts">
defineProps({
  card: {
    type: Object,
    required: true
  },
  loyalty: {
    type: Object,
    required: false,
    default: () => ({})
  }
})
</script>
<template>
  <div :style="card.style" class="w-1/3 h-64 rounded shadow p-2 flex flex-col">
    <div class="flex items-center gap-2 w-full justify-between">
      <h1>{{ card.name }}</h1>
      <v-chip v-if="loyalty.isClaimed" color="success" text-color="white" class="">
        Claimed!
      </v-chip>
      <v-chip v-if="loyalty.canBeClaimed" color="warning" text-color="white">
        Can be redeem
      </v-chip>
    </div>
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
