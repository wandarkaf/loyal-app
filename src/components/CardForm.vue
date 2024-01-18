<script setup lang="ts">
import { watch, ref, computed, shallowRef } from 'vue'
import { useGeolocation } from '@/composables/useGeolocation'
import { useFileUpload } from '@/composables/useFileUpload'
import { useDevicePermission } from '@/composables/useDevicePermission'
import BaseMap from '@/components/BaseMap.vue'
import BaseCard from '@/components/BaseCard.vue'
import BaseColorPicker from '@/components/BaseColorPicker.vue'
import BaseFileInput from '@/components/BaseFileInput.vue'
import isEqual from 'lodash/isEqual'
import type { infoKey, styleKey, locationKey, cardInfoType, cardLocationType } from '@/types'

const props = defineProps({
  card: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['submit', 'reset'])

const { coords, getGeohash } = useGeolocation()
const { handleFileUpload } = useFileUpload()
const { geolocationAccess } = useDevicePermission()

const tab = shallowRef(null)

const cardInfo = ref<cardInfoType>({
  id: '',
  name: '',
  description: '',
  type: 'stamp',
  maxCount: 10,
  loyalties: [],
  users: []
})
const cardStyle = ref({
  backgroundImage: '',
  backgroundColor: '',
  borderColor: '',
  stampActiveColor: '',
  stampActiveImage: '',
  stampDefaultImage: '',
  stampInactiveColor: '',
  color: '',
  borderWidth: 0,
  icon: 'mdi-coffee-outline',
  hasCustomStamp: false
})
const cardLocation = ref<cardLocationType>({
  lat: 0,
  lng: 0
})

const isDisabled = computed(
  () =>
    isEqual(cardStyle.value, props.card.style) &&
    isEqual(cardInfo.value, props.card) &&
    isEqual(cardLocation.value, props.card.location)
)

const marker = computed(() => ({
  lat: cardLocation.value.lat,
  lng: cardLocation.value.lng,
  props: {
    draggable: true,
    ...(cardLocation.value.icon
      ? {
          icon: {
            url: cardLocation.value.icon,
            scaledSize: { width: 45, height: 45 }
          }
        }
      : {})
  }
}))

const setInfoKeyValue = (key: string, value: string) => {
  cardInfo.value[key as infoKey] = value
}

const setStyleKeyValue = (key: string, value: string) => {
  cardStyle.value[key as styleKey] = value
}
const setLocationKeyValue = (key: string, value: string) => {
  cardLocation.value[key as locationKey] = value
}

const handleCoordsUpdate = (position: { lat: number; lng: number }) => {
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
  emit('submit', {
    ...cardInfo.value,
    style: { ...cardStyle.value },
    location: { ...cardLocation.value, geoHash: getGeohash(cardLocation.value) }
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
            <BaseFileInput
              :imageSource="cardInfo.logo || ''"
              inputId="logoImage"
              label="Logo"
              @change.stop="($event) => handleFileUpload($event, 'logo', setInfoKeyValue)"
            />
            <VTextField v-model="cardInfo.maxCount" label="Max count" type="number" />
            <VTextarea v-model="cardInfo.description" label="Description" counter="500" noResize />
            <BaseFileInput
              :imageSource="cardLocation.icon || ''"
              inputId="iconImage"
              label="Icon"
              @change.stop="($event) => handleFileUpload($event, 'icon', setLocationKeyValue)"
            />
            <VBtn
              v-if="geolocationAccess === 'granted'"
              @click="handleCoordsUpdate({ lat: coords.latitude, lng: coords.longitude })"
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
              :markers="[marker]"
              @handleCoordsUpdate="handleCoordsUpdate"
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
                <BaseColorPicker v-model="cardStyle.backgroundColor">
                  Background color
                </BaseColorPicker>
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
            <div v-if="cardStyle.hasCustomStamp" class="flex gap-2">
              <div class="basis-1/2">
                <BaseFileInput
                  :imageSource="cardStyle.stampDefaultImage || ''"
                  inputId="stampDefaultImage"
                  label="Stamp default image"
                  @change.stop="
                    ($event) => handleFileUpload($event, 'stampDefaultImage', setStyleKeyValue)
                  "
                />
              </div>
              <div class="basis-1/2">
                <BaseFileInput
                  :imageSource="cardStyle.stampActiveImage || ''"
                  inputId="stampActiveImage"
                  label="Stamp active image"
                  @change.stop="
                    ($event) => handleFileUpload($event, 'stampActiveImage', setStyleKeyValue)
                  "
                />
              </div>
            </div>
            <template v-else>
              <BaseColorPicker v-model="cardStyle.stampActiveColor">Active stamp</BaseColorPicker>
              <BaseColorPicker v-model="cardStyle.stampInactiveColor">
                Default stamp
              </BaseColorPicker>

              <v-select
                v-model="cardStyle.icon"
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
            <div>
              <v-switch
                v-model="cardStyle.hasCustomStamp"
                label="Custom stamp"
                color="primary"
                inset
              ></v-switch>
            </div>
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
