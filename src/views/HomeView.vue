<script setup lang="ts">
import BaseParallax from '@/components/BaseParallax.vue'
import BaseHero from '@/components/BaseHero.vue'
import QRcode from '@/components/QRcode.vue'
</script>

<template>
  <div>
    <BaseParallax src="https://cdn.vuetifyjs.com/images/parallax/material.jpg" height="500">
      <h2 class="mb-4 text-2xl">The best company</h2>
      <h4 class="">Let's help each other!</h4>
    </BaseParallax>
    <QRcode />
    <BaseHero></BaseHero>
    <BaseHero></BaseHero>

    <BaseParallax src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg" height="300">
      <h1 class="mb-4 text-2xl">SIGN UP FOR BETTER SLEEP</h1>
      <h4 class="">7 free tips to get your baby sleeping well now!</h4>
    </BaseParallax>
    <BaseHero></BaseHero>

    <BaseParallax src="https://cdn.vuetifyjs.com/images/parallax/material2.jpg" height="300">
      <h1 class="mb-4 text-2xl">SLEEP TRAINING PACKAGES</h1>
      <h4 class="">Yes, your child CAN sleep through the night!</h4>
    </BaseParallax>
    <BaseHero></BaseHero>
    <!-- cards -->
    <BaseParallax src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg" height="300">
      <h1 class="mb-4 text-2xl">SIGN UP FOR BETTER SLEEP</h1>
      <h4 class="">7 free tips to get your baby sleeping well now!</h4>
    </BaseParallax>
    <BaseHero></BaseHero>
    <BaseHero></BaseHero>
    <BaseParallax src="https://cdn.vuetifyjs.com/images/parallax/material2.jpg" height="300">
      <h1 class="mb-4 text-2xl">SLEEP TRAINING PACKAGES</h1>
      <h4 class="">Yes, your child CAN sleep through the night!</h4>
    </BaseParallax>
  </div>
</template>
./QRPrinter ./QRIncubator
