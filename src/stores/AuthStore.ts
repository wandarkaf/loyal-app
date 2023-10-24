// import { ref } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'
// import { db, collection, getDocs } from '@/firebase'
// import type { DocumentData } from 'firebase/firestore'

export const useAuthStore = defineStore(
  'AuthStore',
  () => {
    return {}
  },
  { historyEnabled: false }
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
