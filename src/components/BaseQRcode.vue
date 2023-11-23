<script setup lang="ts">
import { ref, type PropType } from 'vue'
import { QRCode } from 'qr-incubator'
import type { qrTag } from 'qr-incubator'
import { onMounted } from 'vue'

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  element: {
    type: String as PropType<qrTag>,
    default: 'svg'
  }
})

const qrcode = ref<HTMLBodyElement | null>(null)

onMounted(() => {
  if (!qrcode.value) return
  QRCode(qrcode.value || null, {
    text: props.text,
    tag: props.element
  })
})
</script>
<template>
  <div ref="qrcode" id="qrcode"></div>
</template>

<style scoped></style>
