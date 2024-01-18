<script setup lang="ts">
import type { PropType } from 'vue'
import type { marker } from '@/types'

defineProps({
  center: {
    type: Object,
    required: true
  },
  markers: {
    type: Array as PropType<marker[]>,
    required: true
  },
  mapProps: {
    type: Object,
    required: false,
    default: () => ({
      zoom: 16,
      'map-type-id': 'terrain'
    })
  }
})

const emit = defineEmits(['handleCoordsUpdate'])

const handleCoordsUpdate = (e: any) => {
  emit('handleCoordsUpdate', {
    lat: e.latLng.lat(),
    lng: e.latLng.lng()
  })
}
</script>
<template>
  <GMapMap :center="center" v-bind="mapProps" class="w-full h-full">
    <!-- :options="{
      zoomControl: true,
      mapTypeControl: true,
      scaleControl: true,
      streetViewControl: true,
      rotateControl: true,
      fullscreenControl: true
    }" -->

    <GMapMarker
      v-for="(marker, index) in markers"
      :key="index"
      :position="marker"
      v-bind="{
        ...marker.props
      }"
      @click="handleCoordsUpdate"
      @dragend="handleCoordsUpdate"
    />
  </GMapMap>
</template>

<style scoped></style>
