export type styleKey = 'backgroundImage' | 'stampActiveImage' | 'stampDefaultImage'
export type locationKey = 'icon'
export type infoKey = 'logo'

export type cardInfoType = {
  id?: string
  name?: string
  logo?: string
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

export type coordinates = { lat: number; lng: number }
