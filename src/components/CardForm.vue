<script setup lang="ts">
import BaseCard from '@/components/BaseCard.vue'
import BaseColorPicker from '@/components/BaseColorPicker.vue'
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

const { coords, locatedAt, error } = useGeolocation()
const geolocationAccess = usePermission('geolocation')

const cardInfo = ref<{
  name: string
  description: string
  type: string
  maxCount: number
  icon: string
  loyalties: string[]
  users: string[]
  location?: {
    geohash?: string | null
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
  users: [],
  location: {
    geohash: null,
    lat: 0,
    lng: 0
  }
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

const markers = ref([
  {
    position: {
      lat: 51.093048,
      lng: 6.84212
    }
  },
  {
    position: {
      lat: 51.198429,
      lng: 6.69529
    }
  },
  {
    position: {
      lat: 51.165218,
      lng: 7.067116
    }
  },
  {
    position: {
      lat: 51.09256,
      lng: 6.84074
    }
  }
])

const getCoords = () => {
  console.log('get coords')
  console.log(
    JSON.stringify(
      {
        coords: coords.value,
        locatedAt: locatedAt.value,
        error: error.value
      },
      null,
      2
    )
  )
  cardLocation.value = {
    ...cardLocation.value,
    lat: coords.value.latitude,
    lng: coords.value.longitude
  }
}

const handlePinClick = (e: any) => {
  console.log(e)
  cardLocation.value = {
    ...cardLocation.value,
    lat: e.latLng.lat(),
    lng: e.latLng.lng()
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
  console.log(geohash)
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
  <VContainer>
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-4 w-full">
        <h2 class="text-2xl">Preview</h2>
        <BaseCard
          :card="{ ...cardInfo, style: { ...cardStyle } }"
          :loyalty="{ count: 3 }"
          class="self-center"
          demo
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
                  'mdi-hamburger',
                  'mdi-fruit-pineapple'
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
        <div class="col-span-3">
          <h3 class="text-xl mb-8">Location</h3>
          <div class="w-full h-96">
            <GMapMap
              :center="{ lat: cardLocation.lat, lng: cardLocation.lng }"
              :zoom="16"
              map-type-id="terrain"
              class="w-full h-full"
              :options="{
                zoomControl: true,
                mapTypeControl: true,
                scaleControl: true,
                streetViewControl: true,
                rotateControl: true,
                fullscreenControl: true
              }"
            >
              <GMapMarker
                v-for="(m, index) in [cardLocation]"
                :key="index"
                :position="{ lat: m.lat, lng: m.lng }"
                :clickable="true"
                :draggable="true"
                @click="handlePinClick"
                @dragend="handlePinClick"
              />
            </GMapMap>
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
  </VContainer>
</template>

<style scoped></style>
