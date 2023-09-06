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
  <VParallax :src="src" :height="height">
    <div class="justify-center flex flex-col h-full items-center text-white">
      <slot />
    </div>
  </VParallax>
</template>

<style scoped></style>
