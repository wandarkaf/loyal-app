<script setup lang="ts">
import { shallowRef, defineProps, onBeforeUnmount, watchEffect } from 'vue'
import { useUserMedia } from '@vueuse/core'
import { BarcodeDetector } from 'barcode-detector/pure'
import { useTouchScreen } from '@/composables/useTouchScreen'

defineProps({
  modelValue: {
    type: String,
    required: true
  },
  width: {
    type: Number,
    default: 640
  },
  height: {
    type: Number,
    default: 480
  }
})

const emit = defineEmits(['update:modelValue'])

const codeDetector = shallowRef<BarcodeDetector>(
  new BarcodeDetector({
    formats: ['qr_code']
  })
)
const video = shallowRef<HTMLVideoElement>()
const detectInterval = shallowRef<NodeJS.Timeout>()

const { hasTouchScreen } = useTouchScreen()
const { stream, start, stop } = useUserMedia({
  constraints: {
    video: {
      facingMode: hasTouchScreen.value ? 'environment' : 'user'
    },
    audio: false
  }
})

const detectCode = async () => {
  if (video.value && video.value.srcObject) {
    const codes = (await codeDetector.value?.detect(video.value)) || []
    if (codes.length > 0) {
      emit('update:modelValue', codes[0].rawValue)
      clearInterval(detectInterval.value)
    } else {
      emit('update:modelValue', '')
    }
  }
}

onBeforeUnmount(() => {
  clearInterval(detectInterval.value)
  stop()
})

watchEffect(() => {
  if (video.value) {
    video.value.srcObject = stream.value as MediaStream
    start()
    detectInterval.value = setInterval(detectCode, 1000)
  }
})
</script>
<template>
  <video ref="video" :width="width" :height="height" class="max-h-screen" autoplay />
</template>

<style scoped></style>
