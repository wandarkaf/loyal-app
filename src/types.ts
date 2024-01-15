export type styleKey = 'backgroundImage' | 'stampActiveImage' | 'stampDefaultImage'
export type locationKey = 'icon'
export type cardInfoType = {
  id?: string
  name?: string
  description?: string
  type?: string
  maxCount?: number
  icon?: string
  loyalties?: string[]
  users?: string[]
}

export type cardLocationType = {
  icon?: string
  geohash?: string
  lat: number
  lng: number
}
