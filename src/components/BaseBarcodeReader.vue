<script setup lang="ts">
import { onUnmounted, shallowRef, defineProps, onMounted } from 'vue'
import type { PropType } from 'vue'

defineProps({
  modelValue: {
    type: String as PropType<string | null>,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const codeDetector = shallowRef()
const barcodeDetectorSupported = shallowRef([''])
const video = shallowRef<HTMLVideoElement>()

if (!('BarcodeDetector' in globalThis)) {
  console.log('Barcode Detector is not supported by this browser.')
} else {
  console.log('Barcode Detector supported!')

  BarcodeDetector.getSupportedFormats().then(
    (arr: string[]) => (barcodeDetectorSupported.value = arr)
  )
  // create new detector
  codeDetector.value = new BarcodeDetector({
    formats: ['qr_code']
  })
}

// Detect code function
const detectCode = async () => {
  // Start detecting codes on to the video element
  console.log(video.value)
  console.log(codeDetector.value)
  if (!video.value) return

  const codes = (await codeDetector.value?.detect(video.value)) || []
  console.log(codes)
  if (codes.length >= 0) {
    emit('update:modelValue', codes[0].rawValue)
    clearInterval(interval)
  }
}

const interval = setInterval(detectCode, 1000)

onMounted(async () => {
  // Check if device has camera
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Use video without audio
    const constraints = {
      video: true,
      audio: false
    }

    const stream = await navigator.mediaDevices.getUserMedia(constraints)
    video.value.srcObject = stream
    detectCode()
  }
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>
<template>
  <div>
    <video ref="video" width="640" height="480" autoplay></video>
  </div>
</template>

<style scoped></style>
