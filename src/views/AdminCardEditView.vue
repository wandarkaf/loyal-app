<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useCardStore } from '@/stores/CardStore'
import BaseCard from '@/components/BaseCard.vue'
import BaseColorPicker from '@/components/BaseColorPicker.vue'
import { watch, ref } from 'vue'
import isEqual from 'lodash/isEqual'
import differenceWith from 'lodash/differenceWith'

const route = useRoute()
const cardStore = useCardStore()

const localCard = ref<{
  name: string
  description: string
  type: string
  maxCount: number
  icon: string
  loyalties: string[]
  users: string[]
  location?: {
    lat: number
    lng: number
  }
}>({
  name: '',
  description: '',
  type: 'stamp',
  maxCount: 10,
  icon: 'mdi-coffee-outline',
  loyalties: [],
  users: []
})
const cardStyle = ref({
  backgroundColor: '',
  borderColor: '',
  stampActiveColor: '',
  stampInactiveColor: '',
  color: '',
  borderWidth: 0
})

cardStore.fetchCard(route.params.id as string)

const saveCard = () => {
  cardStore.upsertCard(route.params.id as string, localCard.value)
}

const reset = () => {
  localCard.value = { ...cardStore.card }
  cardStyle.value = { ...cardStore.card.style }
}

watch(
  () => cardStore.card,
  (card) => {
    localCard.value = { ...card }
    cardStyle.value = { ...card.style }
  }
)
</script>
<template>
  <VContainer>
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-4 w-full">
        <h2 class="text-2xl">Preview</h2>
        <BaseCard
          :card="{ ...localCard, style: { ...cardStyle } }"
          :loyalty="{ count: 3 }"
          class="self-center"
        />
      </div>
      <div class="grid grid-cols-5 gap-4">
        <div class="col-span-3">
          <h3 class="text-xl">Style</h3>
          <div class="grid grid-cols-3 gap-4">
            <div class="flex flex-col gap-2">
              <h4>General</h4>
              <BaseColorPicker v-model="cardStyle.backgroundColor">Background</BaseColorPicker>
              <BaseColorPicker v-model="cardStyle.color">text</BaseColorPicker>
            </div>
            <div class="flex flex-col gap-2">
              <h4>Border</h4>
              <BaseColorPicker v-model="cardStyle.borderColor">Border</BaseColorPicker>
              <VTextField
                v-model="cardStyle.borderWidth"
                label="Border width"
                type="number"
                suffix="px"
              />
            </div>
            <div class="flex flex-col gap-2">
              <h4>Stamp</h4>
              <BaseColorPicker v-model="cardStyle.stampActiveColor"> Active stamp </BaseColorPicker>
              <BaseColorPicker v-model="cardStyle.stampInactiveColor">
                Default stamp
              </BaseColorPicker>
              <VTextField v-model="localCard.maxCount" label="Max count" type="number" />
              <v-select
                v-model="localCard.icon"
                label="Icon"
                :items="[
                  'mdi-coffee-outline',
                  'mdi-coffee',
                  'mdi-mushroom',
                  'mdi-alien',
                  'mdi-arm-flex',
                  'mdi-bacteria'
                ]"
              ></v-select>
            </div>
          </div>
        </div>

        <div class="col-span-2">
          <h3 class="text-xl mb-8">Info</h3>
          <VTextField v-model="localCard.name" label="Name" required />
          <VTextarea v-model="localCard.description" label="Description" counter="500" noResize />
        </div>
      </div>
      <div class="flex gap-4 justify-end">
        <VBtn
          @click="saveCard"
          color="primary"
          :disabled="isEqual(cardStyle, cardStore.card.style) && isEqual(localCard, cardStore.card)"
        >
          Save
        </VBtn>
        <VBtn
          :disabled="isEqual(cardStyle, cardStore.card.style) && isEqual(localCard, cardStore.card)"
          @click="reset"
          >Reset</VBtn
        >
      </div>
    </div>
  </VContainer>
</template>

<style scoped></style>
