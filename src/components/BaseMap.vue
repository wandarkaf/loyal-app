<script setup lang="ts">
defineProps({
  center: {
    type: Object,
    required: true
  },
  markers: {
    type: Array,
    required: true
  },
  mapProps: {
    type: Object,
    required: false,
    default: () => ({
      zoom: 16,
      'map-type-id': 'terrain'
    })
  },
  markerProps: {
    type: Object,
    required: false,
    default: () => ({})
  }
})

const emit = defineEmits(['handlePinUpdate'])

const handlePinUpdate = (e: any) => {
  emit('handlePinUpdate', {
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
        markerProps,
        ...(marker.icon
          ? { icon: { url: marker.icon, scaledSize: { width: 40, height: 40 } } }
          : {})
      }"
      @click="handlePinUpdate"
      @dragend="handlePinUpdate"
    />
  </GMapMap>
</template>

<style scoped></style>
