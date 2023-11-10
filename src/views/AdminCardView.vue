<script setup lang="ts">
import { useLoyaltyStore } from '@/stores/LoyaltyStore'
import { useRoute } from 'vue-router'

const loyaltyStore = useLoyaltyStore()
const route = useRoute()

loyaltyStore.fetchLoyaltiesByCardId(route.params.id as string)

const upsertLoyalty = (item: any) => {
  loyaltyStore.upsertLoyalty(item.id, {
    stamps: item.stamps + 1
  })
}
</script>

<template>
  <VContainer>
    <v-virtual-scroll :items="loyaltyStore.loyalties" height="300">
      <template v-slot:default="{ item }">
        <v-list-item :title="item.cardId" :subtitle="item.userId">
          <template v-slot:prepend>
            <v-avatar>
              <v-img :src="item.avatar" :alt="item.name"></v-img>
            </v-avatar>
          </template>

          <template v-slot:append>
            <v-btn icon="mdi-stamper" variant="text" @click="upsertLoyalty(item)"></v-btn>
          </template>
        </v-list-item>
      </template>
    </v-virtual-scroll>
  </VContainer>
</template>
