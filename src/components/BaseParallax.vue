<script setup lang="ts">
defineProps({
  src: {
    type: String,
    default: ''
  },
  height: {
    type: [Number, String],
    default: 500
  }
})
</script>
<template>
  <v-parallax :src="src" :height="height">
    <div class="justify-center flex flex-col h-full items-center text-white">
      <slot />
    </div>
  </v-parallax>
</template>

<style scoped></style>
