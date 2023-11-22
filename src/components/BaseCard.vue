<script setup lang="ts">
import { ref, computed } from 'vue'

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

const show = ref(false)

const redeemMap = computed(() =>
  Array.from({ length: props.card.maxCount }, (_, i) =>
    i < props.loyalty.count
      ? props.card.style.stampActiveColor
      : props.card.style.stampInactiveColor
  )
)

const cardStyle = computed(() => {
  return {
    ...props.card.style,
    borderWidth: `${props.card.style?.borderWidth}px`
  }
})
</script>
<template>
  <VCard :style="cardStyle" class="w-96" :image="card.style.backgroundImage" :title="card.name">
    <template v-slot:append>
      <v-chip v-if="loyalty.redeem" color="success" variant="flat" text-color="white" class=""
        >Redeem</v-chip
      >
      <v-chip v-if="loyalty.canBeRedeem" color="warning" variant="flat" text-color="white"
        >Redeemed</v-chip
      >
    </template>
    <v-card-text class="flex items-center h-fit">
      <div v-if="card.maxCount" class="flex flex-wrap gap-4 justify-center">
        <v-icon
          v-for="(item, index) in redeemMap"
          :key="`${index}${card.id}`"
          :size="56"
          :icon="card.icon"
          :color="item"
        ></v-icon>
      </div>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'" @click="show = !show"></v-btn>
    </v-card-actions>

    <v-expand-transition>
      <div v-show="show" class="bg-white">
        <v-divider></v-divider>
        <v-card-text> {{ card.description }} </v-card-text>
      </div>
    </v-expand-transition>
  </VCard>
</template>

<style scoped></style>
