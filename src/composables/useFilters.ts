import { shallowRef, watch } from 'vue'
import { useLoyaltyStore } from '@/stores/LoyaltyStore'

export function useFilters(id: string, key: string = 'cardId') {
  const loyaltyStore = useLoyaltyStore()

  type filter = 'active' | 'canBeRedeem' | 'redeem'
  const filters = shallowRef<filter[]>(['active', 'canBeRedeem', 'redeem'])
  const selectedFilters = shallowRef<filter[]>(['active', 'canBeRedeem'])

  watch(selectedFilters, (value) => {
    loyaltyStore.fetchLoyalties(id, value, key)
  })

  return { filters, selectedFilters }
}
