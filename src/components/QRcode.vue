<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import { QRCode } from 'qr-incubator'
import type { qrTag } from 'qr-incubator'

const qrcode = ref<HTMLBodyElement | null>(null)
const text = shallowRef('https://www.typescriptlang.org/docs/handbook/2/classes.html')
const element = shallowRef<qrTag>('canvas')

const generateQRCode = () => {
  if (!qrcode.value) return
  QRCode(qrcode.value, {
    text: text.value,
    tag: element.value
  })
}
</script>
<template>
  <VContainer>
    <VTextField v-model="text" label="Text" />
    <v-select v-model="element" label="Element" :items="['svg', 'canvas', 'table']"></v-select>
    <VBtn @click="generateQRCode">Generate QR Code</VBtn>
    <div ref="qrcode" id="qrcode"></div>
  </VContainer>
</template>

<style scoped></style>
