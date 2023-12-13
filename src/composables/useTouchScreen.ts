import { shallowRef } from 'vue'

export function useTouchScreen() {
  const hasTouchScreen = shallowRef<boolean>(false)

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
  return { hasTouchScreen }
}
