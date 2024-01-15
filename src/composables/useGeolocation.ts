import { useGeolocation as useGeolocationCore } from '@vueuse/core'

export function useGeolocation() {
  const { coords } = useGeolocationCore()

  return { coords }
}
