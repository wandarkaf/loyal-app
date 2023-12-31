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

const props = defineProps({
  card: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['submit', 'reset'])

const { coords } = useGeolocation()
const geolocationAccess = usePermission('geolocation')

const cardInfo = ref<{
  id?: string
  name?: string
  description?: string
  type?: string
  maxCount?: number
  icon?: string
  loyalties?: string[]
  users?: string[]
  filesToUpload?: { key: string; blob: File }[] | null
}>({
  id: '',
  name: '',
  description: '',
  type: 'stamp',
  maxCount: 10,
  icon: 'mdi-coffee-outline',
  loyalties: [],
  users: [],
  filesToUpload: []
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

const handleImageUpload = (e: Event, key: 'backgroundImage' | 'stampActiveImage') => {
  const inputElement = e.target as HTMLInputElement
  const fileToUpload = inputElement.files ? inputElement.files[0] : null
  cardInfo.value.filesToUpload = [{ key, blob: fileToUpload as File }]
  const reader = new FileReader()
  reader.onload = (event) => {
    cardStyle.value[key] = event.target ? (event.target.result as string) : ''
  }
  reader.readAsDataURL(fileToUpload as Blob)
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
    <div class="grid grid-cols-5 gap-4">
      <div class="col-span-3">
        <BaseFileInput
          :imageSource="cardStyle.backgroundImage || ''"
          inputId="backgroundImage"
          label="Background image"
          @change="($event) => handleImageUpload($event, 'backgroundImage')"
        />
        <BaseColorPicker v-model="cardStyle.backgroundColor">Background</BaseColorPicker>
        <BaseColorPicker v-model="cardStyle.color">text</BaseColorPicker>
      </div>
      <div class="flex flex-col gap-2">
        <BaseColorPicker v-model="cardStyle.borderColor">Border</BaseColorPicker>
        <VTextField
          v-model="cardStyle.borderWidth"
          label="Border width"
          type="number"
          suffix="px"
        />
      </div>
      <div class="flex flex-col gap-2">
        <BaseColorPicker v-model="cardStyle.stampActiveColor">Active stamp</BaseColorPicker>
        <BaseColorPicker v-model="cardStyle.stampInactiveColor"> Default stamp </BaseColorPicker>
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
            'mdi-hamburger',
            'mdi-fruit-pineapple'
          ]"
        ></v-select>
      </div>
      <div class="col-span-2">
        <h3 class="text-xl mb-8">Info</h3>
        <VTextField v-model="cardInfo.name" label="Name" required />
        <VTextarea v-model="cardInfo.description" label="Description" counter="500" noResize />
      </div>
      <div class="col-span-3">
        <h3 class="text-xl mb-8">Location</h3>
        <div class="w-full h-96">
          <BaseMap
            :center="{ lat: cardLocation.lat, lng: cardLocation.lng }"
            :markers="[cardLocation]"
            :markerProps="{ draggable: true }"
            @handlePinUpdate="handlePinUpdate"
          />
        </div>

        <VBtn
          v-if="geolocationAccess === 'granted'"
          @click="getCoords"
          :loading="(coords.latitude && coords.longitude) === Infinity"
          :disabled="(coords.latitude && coords.longitude) === Infinity"
          icon="mdi-map-marker"
        />
      </div>
    </div>
    <div class="flex gap-4 justify-end">
      <VBtn @click="submit" color="primary" :disabled="isDisabled"><slot></slot></VBtn>
      <VBtn :disabled="isDisabled" @click="reset">Reset</VBtn>
    </div>
  </div>
</template>

<style scoped></style>
