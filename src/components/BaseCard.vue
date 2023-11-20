<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
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

const redeemMap = computed(() =>
  Array.from({ length: props.card.maxCount }, (_, i) =>
    i < props.loyalty.count
      ? props.card.style.stampActiveColor
      : props.card.style.stampInactiveColor
  )
)

const cardStyle = computed(() => {
  return { ...props.card.style, borderWidth: `${props.card.style?.borderWidth}px` }
})
</script>
<template>
  <div :style="cardStyle" class="h-64 w-96 rounded shadow p-2 flex flex-col">
    <div class="flex items-center gap-2 w-full justify-between">
      <h1>{{ card.name }}</h1>
      <v-chip v-if="loyalty.redeem" color="success" text-color="white" class="">Redeem!</v-chip>
      <v-chip v-if="loyalty.canBeRedeem" color="warning" text-color="white">Can be redeem</v-chip>
    </div>
    <div v-if="card.maxCount" class="flex flex-wrap gap-4 content-center grow">
      <v-icon
        v-for="(item, index) in redeemMap"
        :key="`${index}${card.id}`"
        :size="56"
        :icon="card.icon"
        :color="item"
      ></v-icon>
    </div>
  </div>
</template>

<style scoped></style>
