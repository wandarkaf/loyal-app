<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCardStore } from '@/stores/CardStore'
import { useUserStore } from '@/stores/UserStore'
import { useLoyaltyStore } from '@/stores/LoyaltyStore'
import { useAuthStore } from '@/stores/AuthStore'

import BaseQRcode from './BaseQRcode.vue'

const cardStore = useCardStore()
const userStore = useUserStore()
const loyaltyStore = useLoyaltyStore()
const authStore = useAuthStore()

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
  canAddLoyalty: {
    type: Boolean,
    default: false
  },
  demo: {
    type: Boolean,
    default: false
  },
  highlight: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()

const show = ref(false)

const qrUrl = computed(() => `${props.loyalty.id}`)

const redeemMap = computed(() => {
  const { count } = props.loyalty
  const { maxCount } = props.card
  const {
    hasCustomStamp,
    stampActiveColor,
    stampActiveImage,
    stampInactiveColor,
    stampDefaultImage
  } = props.card.style
  return Array.from({ length: maxCount }, (_, i) =>
    i < count
      ? hasCustomStamp
        ? stampActiveImage
        : stampActiveColor
      : hasCustomStamp
        ? stampDefaultImage
        : stampInactiveColor
  )
})

const cardStyle = computed(() => {
  return {
    ...props.card.style,
    borderWidth: `${props.card.style?.borderWidth}px`
  }
})

const addLoyalty = async () => {
  const newLoyalty = await loyaltyStore.createLoyalty({
    userId: authStore.authUser?.uid,
    cardId: props.card.id
  })

  // update card loyalties
  cardStore.upsertCard(props.card.id, {
    ...props.card,
    loyalties: [...props.card.loyalties, newLoyalty?.id],
    users: [...props.card.users, authStore.authUser?.uid]
  })
  // update user loyalties
  userStore.upsertUser(authStore.authUser?.uid ?? '', {
    loyalties: [...(authStore.authUser?.loyalties ?? []), newLoyalty?.id],
    cards: [...(authStore.authUser?.cards ?? []), props.card.id]
  })
  // refresh data
  // loyaltyStore.fetchLoyalties({ id: route.params.id as string, filters: selectedFilters.value })
  router.push({
    name: 'loyalty'
  })
}
</script>
<template>
  <VCard
    v-if="card.style"
    :style="cardStyle"
    :image="card.style.backgroundImage"
    :elevation="highlight ? 14 : 4"
    hover
  >
    <template v-slot:append>
      <v-chip v-if="loyalty.redeem" color="success" variant="flat" text-color="white" class="">
        Redeem
      </v-chip>
      <v-chip v-if="loyalty.canBeRedeem" color="warning" variant="flat" text-color="white">
        Redeemed
      </v-chip>
    </template>
    <v-card-title>
      <v-img v-if="card.logo" :src="card.logo" height="44" />
      <span v-else class="">{{ card.name }}</span>
    </v-card-title>
    <v-card-text class="flex items-center h-fit">
      <div v-if="card.maxCount" class="grid grid-cols-5 gap-4">
        <template v-if="card.style.hasCustomStamp">
          <v-img
            v-for="(item, index) in redeemMap"
            :key="`${index}${card.id}`"
            :src="item"
            width="56"
            height="56"
          />
        </template>
        <template v-else>
          <v-icon
            v-for="(item, index) in redeemMap"
            :key="`${index}${card.id}`"
            :size="56"
            :icon="card.style.icon"
            :color="item"
          ></v-icon>
        </template>
      </div>
    </v-card-text>

    <v-card-actions>
      <v-btn v-if="canAddLoyalty" icon="mdi-plus" @click="addLoyalty"></v-btn>

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
