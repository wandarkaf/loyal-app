<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import BaseQRcode from './BaseQRcode.vue'

const props = defineProps({
  card: {
    type: Object,
    required: true
  },
  loyalty: {
    type: Object,
    required: false,
    default: () => ({})
  },
  demo: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()
const route = useRoute()

const show = ref(false)

const qrUrl = computed(
  () =>
    `${import.meta.env.BASE_URL}loyalty/${props.loyalty.id}/${
      props.loyalty.canBeRedeem ? 'redeem' : 'add'
    }`
)

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
      <template v-if="!demo">
        <v-spacer></v-spacer>
        <v-btn :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'" @click="show = !show"></v-btn>
      </template>
    </v-card-actions>

    <template v-if="!demo">
      <v-expand-transition>
        <div v-show="show" class="bg-white">
          <v-card-text class="flex justify-center">
            <BaseQRcode v-if="!loyalty.redeem" :text="qrUrl" />
          </v-card-text>
        </div>
      </v-expand-transition>
    </template>
  </VCard>
</template>

<style scoped></style>
