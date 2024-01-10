<script setup lang="ts">
import BaseMap from '@/components/BaseMap.vue'
import BaseCard from '@/components/BaseCard.vue'
import BaseColorPicker from '@/components/BaseColorPicker.vue'
import BaseFileInput from '@/components/BaseFileInput.vue'
import { watch, ref, computed } from 'vue'
import { useGeolocation } from '@vueuse/core'
import isEqual from 'lodash/isEqual'
import * as geofire from 'geofire-common'
import { usePermission } from '@vueuse/core'
import { useFileUpload } from '@/composables/useFileUpload'
import type { styleKey, cardInfoType } from '@/types'
import { shallowRef } from 'vue'

const props = defineProps({
  card: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['submit', 'reset'])

const { coords } = useGeolocation()
const geolocationAccess = usePermission('geolocation')
const { handleFileUpload } = useFileUpload()

const tab = shallowRef(null)
const hasCustomStamp = shallowRef(false)

const cardInfo = ref<cardInfoType>({
  id: '',
  name: '',
  description: '',
  type: 'stamp',
  maxCount: 10,
  icon: 'mdi-coffee-outline',
  loyalties: [],
  users: []
})
const cardStyle = ref({
  backgroundImage: '',
  backgroundColor: '',
  borderColor: '',
  stampActiveColor: '',
  stampActiveImage: '',
  stampInactiveColor: '',
  color: '',
  borderWidth: 0
})
const cardLocation = ref({
  geohash: null,
  lat: 0,
  lng: 0
})

const isDisabled = computed(
  () =>
    isEqual(cardStyle.value, props.card.style) &&
    isEqual(cardInfo.value, props.card) &&
    isEqual(cardLocation.value, props.card.location)
)

const setStyleKeyValue = (key: string, value: string) => {
  cardStyle.value[key as styleKey] = value
}

const getCoords = () => {
  cardLocation.value = {
    ...cardLocation.value,
    lat: coords.value.latitude,
    lng: coords.value.longitude
  }
}

const handlePinUpdate = (position: { lat: number; lng: number }) => {
  cardLocation.value = {
    ...cardLocation.value,
    ...position
  }
}

const reset = () => {
  cardInfo.value = { ...props.card }
  cardStyle.value = { ...props.card.style }
  cardLocation.value = { ...props.card.location }
}

const submit = () => {
  const geohash = geofire.geohashForLocation([
    cardLocation.value.lat,
    cardLocation.value.lng
  ] as any)
  emit('submit', {
    ...cardInfo.value,
    style: cardStyle.value,
    location: { ...cardLocation.value, hash: geohash }
  })
}

watch(
  () => props.card,
  (card) => {
    cardInfo.value = { ...card }
    cardStyle.value = { ...card.style }
    cardLocation.value = { ...card.location }
  }
)
</script>
<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col">
      <BaseCard
        :card="{ ...cardInfo, style: { ...cardStyle } }"
        :loyalty="{ count: 3 }"
        class="self-center"
        demo
      />
    </div>
    <v-tabs v-model="tab" align-tabs="start">
      <v-tab :value="1">General</v-tab>
      <v-tab :value="2">Style</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item :value="1">
        <div class="flex gap-4 m-4">
          <div class="flex flex-col basis-1/3">
            <VTextField v-model="cardInfo.name" label="Name" required />
            <VTextField v-model="cardInfo.maxCount" label="Max count" type="number" />
            <VTextarea v-model="cardInfo.description" label="Description" counter="500" noResize />
            <VBtn
              v-if="geolocationAccess === 'granted'"
              @click="getCoords"
              :loading="(coords.latitude && coords.longitude) === Infinity"
              :disabled="(coords.latitude && coords.longitude) === Infinity"
              prepend-icon="mdi-map-marker"
            >
              Find my location
            </VBtn>
          </div>
          <div class="flex grow">
            <BaseMap
              :center="{ lat: cardLocation.lat, lng: cardLocation.lng }"
              :markers="[cardLocation]"
              :markerProps="{ draggable: true }"
              @handlePinUpdate="handlePinUpdate"
            />
          </div>
        </div>
      </v-window-item>
      <v-window-item :value="2">
        <div class="flex gap-4 m-4">
          <div class="basis-1/2 flex flex-col gap-4">
            <div class="flex gap-4">
              <div class="basis-1/2 flex flex-col gap-2">
                <BaseColorPicker v-model="cardStyle.color">Text color</BaseColorPicker>
                <BaseColorPicker v-model="cardStyle.borderColor">Border</BaseColorPicker>
                <BaseColorPicker v-model="cardStyle.backgroundColor"
                  >Background color</BaseColorPicker
                >
              </div>
              <div class="grow">
                <BaseFileInput
                  :imageSource="cardStyle.backgroundImage || ''"
                  inputId="backgroundImage"
                  label="Background image"
                  @change.stop="
                    ($event) => handleFileUpload($event, 'backgroundImage', setStyleKeyValue)
                  "
                />
              </div>
            </div>
            <div>
              <VTextField
                v-model="cardStyle.borderWidth"
                label="Border width"
                type="number"
                suffix="px"
              />
            </div>
          </div>
          <div class="basis-1/2 flex flex-col gap-2">
            <template v-if="hasCustomStamp">
              <BaseFileInput
                :imageSource="cardStyle.stampActiveImage || ''"
                inputId="stampActiveImage"
                label="Stamp active image"
                @change.stop="
                  ($event) => handleFileUpload($event, 'stampActiveImage', setStyleKeyValue)
                "
              />
            </template>
            <template v-else>
              <BaseColorPicker v-model="cardStyle.stampActiveColor">Active stamp</BaseColorPicker>
              <BaseColorPicker v-model="cardStyle.stampInactiveColor">
                Default stamp
              </BaseColorPicker>

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
                  'mdi-hamburger',
                  'mdi-fruit-pineapple'
                ]"
              ></v-select>
            </template>
            <v-switch v-model="hasCustomStamp" label="Custom stamp" inset></v-switch>
          </div>
        </div>
      </v-window-item>
    </v-window>

    <div class="flex gap-4 justify-end">
      <VBtn @click="submit" color="primary" :disabled="isDisabled"><slot></slot></VBtn>
      <VBtn :disabled="isDisabled" @click="reset">Reset</VBtn>
    </div>
  </div>
</template>

<style scoped></style>
