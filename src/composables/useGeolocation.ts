import { useGeolocation as useGeolocationCore } from '@vueuse/core'
import * as geofire from 'geofire-common'

import type { coordinates } from '@/types'

export function useGeolocation() {
  const { coords } = useGeolocationCore()

  const getGeohash = ({ lat, lng }: coordinates) => geofire.geohashForLocation([lat, lng] as any)

  const getHashBounds = ({ lat, lng, radius = 2 }: coordinates & { radius?: number }) =>
    geofire.geohashQueryBounds([lat, lng], radius * 1000)

  const distanceBetween = ({ lat, lng, center }: coordinates & { center: coordinates }) =>
    geofire.distanceBetween([lat, lng], [center.lat, center.lng])

  return { coords, getGeohash, getHashBounds, distanceBetween }
}
