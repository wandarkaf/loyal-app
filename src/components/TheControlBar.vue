<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'

const { y } = useWindowScroll()

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
<template>
  <div class="fixed bottom-8 z-50 right-8">
    <VScaleTransition>
      <VBtn
        v-show="y >= 200"
        density="default"
        color="primary"
        icon="mdi-chevron-up"
        @click="scrollToTop"
      ></VBtn>
    </VScaleTransition>
  </div>
</template>

<style scoped></style>
