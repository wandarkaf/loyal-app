import { usePermission } from '@vueuse/core'

export function useDevicePermission() {
  const geolocationAccess = usePermission('geolocation')

  return { geolocationAccess }
}
