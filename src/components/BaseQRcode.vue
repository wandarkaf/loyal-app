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
// const windowRef = ref<Window | null>(window)

onMounted(() => {
  if (!qrcode.value) return
  QRCode(qrcode.value || null, {
    // text: `${windowRef.value?.location.origin}${props.text}`,
    text: props.text,
    tag: props.element
  })
})
</script>
<template>
  <div>
    <div ref="qrcode" id="qrcode"></div>
  </div>
</template>

<style scoped></style>
