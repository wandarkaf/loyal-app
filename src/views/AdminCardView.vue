<script setup lang="ts">
import { shallowRef, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { useFilters } from '@/composables/useFilters'

import { useLoyaltyStore } from '@/stores/LoyaltyStore'
import { useCardStore } from '@/stores/CardStore'
import { useUserStore } from '@/stores/UserStore'

import BaseCard from '@/components/BaseCard.vue'
import BaseFilters from '@/components/BaseFilters.vue'
import BaseBarcodeReader from '@/components/BaseBarcodeReader.vue'
import BaseDialog from '@/components/BaseDialog.vue'
import BaseDataTable from '@/components/BaseDataTable.vue'
import { computed } from 'vue'

const loyaltyStore = useLoyaltyStore()
const cardStore = useCardStore()
const userStore = useUserStore()
const route = useRoute()

const { filters, selectedFilters } = useFilters(route.params.id as string)

const loyaltyCode = shallowRef('')
const dialog = shallowRef(false)

loyaltyStore.fetchLoyalties({ id: route.params.id as string, filters: selectedFilters.value })

const upsertLoyalty = async (item: any) => {
  if (item.count === cardStore.card?.maxCount - 1) {
    loyaltyStore.upsertLoyalty(item.id, {
      count: item.count + 1,
      canBeRedeem: true,
      active: false
    })
    const newLoyalty = await loyaltyStore.createLoyalty({
      userId: item.userId,
      cardId: item.cardId
    })

    // update card loyalties
    cardStore.upsertCard(cardStore.card?.id, {
      ...cardStore.card,
      loyalties: [...cardStore.card.loyalties, newLoyalty?.id]
    })
    // update user loyalties
    const user = userStore.users.find((user: any) => user.id === item.userId)
    userStore.upsertUser(item.userId, {
      ...user,
      loyalties: [...user.loyalties, newLoyalty?.id]
    })
    // refresh data
    loyaltyStore.fetchLoyalties({ id: route.params.id as string, filters: selectedFilters.value })
  } else {
    loyaltyStore.upsertLoyalty(item.id, {
      count: item.count + 1
    })
  }
}

const redeemLoyalty = async (item: any) => {
  loyaltyStore.upsertLoyalty(item.id, {
    canBeRedeem: false,
    redeem: true
  })
}

const userDetails = (id: string) => {
  return userStore.users.find((user: any) => user.id === id) || {}
}

watch(loyaltyCode, async (value) => {
  if (value) {
    const loyalty = loyaltyStore.loyalties.find((loyalty: any) => loyalty.id === value)
    await upsertLoyalty(loyalty)
    dialog.value = false
    loyaltyCode.value = ''
  }
})

const headers = shallowRef([
  { title: 'Name', key: 'username' },
  { title: 'Email', key: 'email' },
  { title: 'Actions', key: 'actions', sortable: false }
])

const items = computed(() => {
  return loyaltyStore.loyalties.map((loyalty: any) => {
    const { name: username, email } = userDetails(loyalty.userId)
    return {
      ...loyalty,
      username,
      email,
      cardMaxCount: cardStore.card?.maxCount
    }
  })
})
</script>

<template>
  <VContainer>
    <div class="flex items-center mt-4 mb-6">
      <BaseFilters v-model="selectedFilters" :items="filters" />
      <VSpacer />
      <BaseDialog ref="dialogRef" title="Scanner" v-model="dialog" v-slot="{ dimensions }">
        <BaseBarcodeReader
          v-model="loyaltyCode"
          :width="dimensions.width"
          :height="dimensions.height"
        />
      </BaseDialog>
    </div>

    <div class="flex flex-wrap gap-6">
      <BaseDataTable
        class="flex-grow"
        :headers="headers"
        :items="items"
        @stamp="(item) => upsertLoyalty(item)"
        @redeem="(item) => redeemLoyalty(item)"
      />
      <BaseCard v-if="cardStore.card" :card="cardStore.card" demo />
    </div>
  </VContainer>
</template>
<style>
.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: transform 0.2s ease-in-out;
}
</style>
