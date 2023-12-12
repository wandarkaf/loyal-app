<script setup lang="ts">
import { shallowRef, defineProps, onMounted, onBeforeUnmount } from 'vue'
import { BarcodeDetector } from 'barcode-detector/pure'

defineProps({
  modelValue: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const codeDetector = shallowRef<BarcodeDetector>()
const video = shallowRef<HTMLVideoElement>()
const hasTouchScreen = shallowRef(false)
const detectInterval = shallowRef<NodeJS.Timeout>()

if (!('BarcodeDetector' in globalThis)) {
  console.log('Barcode Detector is not supported by this browser.')
} else {
  console.log('Barcode Detector supported!')

  codeDetector.value = new BarcodeDetector({
    formats: ['qr_code']
  })
}

const detectCode = async () => {
  if (!video.value) return

  const codes = (await codeDetector.value?.detect(video.value)) || []
  console.log(codes)
  if (codes.length > 0) {
    emit('update:modelValue', codes[0].rawValue)
    clearInterval(detectInterval.value)
  } else {
    emit('update:modelValue', '')
  }
}

if ('maxTouchPoints' in navigator) {
  hasTouchScreen.value = navigator.maxTouchPoints > 0
} else if ('msMaxTouchPoints' in navigator) {
  hasTouchScreen.value = navigator['msMaxTouchPoints'] > 0
} else {
  const mQ = matchMedia?.('(pointer:coarse)')
  if (mQ?.media === '(pointer:coarse)') {
    hasTouchScreen.value = !!mQ.matches
  } else if ('orientation' in window) {
    hasTouchScreen.value = true // deprecated, but good fallback
  } else {
    // Only as a last resort, fall back to user agent sniffing
    const UA = navigator['userAgent']
    hasTouchScreen.value =
      /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
      /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)
  }
}

onMounted(async () => {
  // Check if device has camera
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Use video without audio
    const constraints: MediaStreamConstraints = {
      video: {
        facingMode: hasTouchScreen.value ? 'environment' : 'user'
      },
      audio: false
    }

    const stream: MediaStream = await navigator.mediaDevices.getUserMedia(constraints)

    if (!video.value) return
    video.value.srcObject = stream
    detectInterval.value = setInterval(detectCode, 1000)
  }
})

onBeforeUnmount(() => {
  clearInterval(detectInterval.value)
  if (!video.value) return

  if (video.value && video.value.srcObject) {
    const srcObject = video.value.srcObject as MediaStream
    srcObject.getTracks().forEach((stream) => stream.stop())
  }
})
</script>
<template>
  <div>
    <video ref="video" width="640" height="480" autoplay></video>
  </div>
</template>

<style scoped></style>
