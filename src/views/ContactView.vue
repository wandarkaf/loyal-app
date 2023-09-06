<script setup lang="ts">
import BaseParallax from '@/components/BaseParallax.vue'
import ContactForm from '@/components/ContactForm.vue'
</script>
<template>
  <BaseParallax src="https://cdn.vuetifyjs.com/images/parallax/material2.jpg" height="300">
    <h1 class="mb-4 text-2xl">Contact me!</h1>
    <h4 class="">Don't be afraid and let's keep in touch</h4>
  </BaseParallax>
  <VContainer><ContactForm /></VContainer>
</template>

<style scoped></style>
