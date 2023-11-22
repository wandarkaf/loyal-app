<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useCardStore } from '@/stores/CardStore'
import BaseCard from '@/components/BaseCard.vue'
import BaseColorPicker from '@/components/BaseColorPicker.vue'
import { watch, ref, computed } from 'vue'
import { useNotifications } from '@/composables/useNotifications'
import isEqual from 'lodash/isEqual'

const route = useRoute()
const cardStore = useCardStore()
const { addNotification } = useNotifications()

const cardInfo = ref<{
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
  backgroundImage: null,
  backgroundColor: '',
  borderColor: '',
  stampActiveColor: '',
  stampInactiveColor: '',
  color: '',
  borderWidth: 0
})

cardStore.fetchCard(route.params.id as string)

const isDisabled = computed(
  () => isEqual(cardStyle.value, cardStore.card.style) && isEqual(cardInfo.value, cardStore.card)
)

const saveCard = () => {
  cardStore.upsertCard(route.params.id as string, {
    ...cardInfo.value,
    style: { ...cardStyle.value }
  })
  addNotification({
    message: 'Card updated',
    timeout: 5000
  })
}

const reset = () => {
  cardInfo.value = { ...cardStore.card }
  cardStyle.value = { ...cardStore.card.style }
}

const handleImageUpload = (e: Event) => {
  const inputElement = e.target as HTMLInputElement
  const fileToUpload = inputElement.files[0] || null
  cardInfo.value.fileToUpload = fileToUpload
  const reader = new FileReader()
  reader.onload = (event) => {
    cardStyle.value.backgroundImage = event.target.result
  }
  reader.readAsDataURL(fileToUpload)
}

watch(
  () => cardStore.card,
  (card) => {
    cardInfo.value = { ...card }
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
          :card="{ ...cardInfo, style: { ...cardStyle } }"
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
              <label for="backgroundImage">
                <div v-if="cardStyle.backgroundImage">
                  <v-img :src="cardStyle.backgroundImage" />
                </div>
              </label>
              <v-file-input
                id="backgroundImage"
                v-show="!cardStyle.backgroundImage"
                label="File input"
                @change="handleImageUpload"
                accept="image/*"
              ></v-file-input>
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
              <BaseColorPicker v-model="cardStyle.stampActiveColor">Active stamp</BaseColorPicker>
              <BaseColorPicker v-model="cardStyle.stampInactiveColor">
                Default stamp
              </BaseColorPicker>
              <VTextField v-model="cardInfo.maxCount" label="Max count" type="number" />
              <v-select
                v-model="cardInfo.icon"
                label="Icon"
                :items="[
                  'mdi-coffee-outline',
                  'mdi-coffee',
                  'mdi-mushroom',
                  'mdi-alien',
                  'mdi-arm-flex',
                  'mdi-bacteria',
                  'mdi-hamburger'
                ]"
              ></v-select>
            </div>
          </div>
        </div>
        <div class="col-span-2">
          <h3 class="text-xl mb-8">Info</h3>
          <VTextField v-model="cardInfo.name" label="Name" required />
          <VTextarea v-model="cardInfo.description" label="Description" counter="500" noResize />
        </div>
      </div>
      <div class="flex gap-4 justify-end">
        <VBtn @click="saveCard" color="primary" :disabled="isDisabled">Save</VBtn>
        <VBtn :disabled="isDisabled" @click="reset">Reset</VBtn>
      </div>
    </div>
  </VContainer>
</template>

<style scoped></style>
