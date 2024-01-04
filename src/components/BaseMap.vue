<script setup lang="ts">
defineProps({
  center: {
    type: Object,
    required: true
  },
  markers: {
    type: Array,
    required: true
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
  <GMapMap
    :center="center"
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
      v-for="(marker, index) in markers"
      :key="index"
      :position="marker"
      :draggable="true"
      @dragend="handlePinUpdate"
    />
  </GMapMap>
</template>

<style scoped></style>
