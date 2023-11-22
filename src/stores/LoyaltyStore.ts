import { ref } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { db, collection } from '@/firebase'
import type { DocumentData, Unsubscribe } from 'firebase/firestore'
import {
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  query,
  where,
  and,
  or,
  orderBy
  // limit
  // startAfter
} from 'firebase/firestore'
import { useUserStore } from '@/stores/UserStore'
import { useCardStore } from '@/stores/CardStore'

export const useLoyaltyStore = defineStore(
  'LoyaltyStore',
  () => {
    const userStore = useUserStore()
    const cardStore = useCardStore()

    // state
    const loyalties = ref<DocumentData>([])
    const unsubscribes = ref<Unsubscribe[]>([])

    type fetchParams = { id: string; filters: string[]; type?: string }

    async function fetchLoyalties({ id, filters = [], type = 'cardId' }: fetchParams) {
      try {
        if (type === 'cardId') {
          const card = await cardStore.fetchCard(id)
          await userStore.fetchUsers(card.users)
        }
        const optionalFilters = filters.map((filter) => {
          return where(filter, '==', true)
        })
        const loyaltyQuery = await query(
          collection(db, 'loyalties'),
          and(where('createdAt', '<=', new Date()), where(type, '==', id), or(...optionalFilters)),
          orderBy('createdAt', 'desc')
          // startAfter(loyalties.value[loyalties.value.length - 1]),
          // limit(1)
        )

        const unsubscribe = onSnapshot(loyaltyQuery, async (queryDocuments) => {
          loyalties.value = await queryDocuments.docs.map((document) => {
            if (document.exists()) {
              return { id: document.id, ...document.data() }
            }
            return null
          })
        })
        unsubscribes.value = [...unsubscribes.value, unsubscribe]
      } catch (e) {
        console.error('Error getting document: ', e)
        loyalties.value = []
      }
    }

    async function createLoyalty(payload: any) {
      try {
        const loyaltyRef = await addDoc(collection(db, 'loyalties'), {
          ...payload,
          count: 0,
          canBeRedeem: false,
          redeem: false,
          active: true,
          createdAt: serverTimestamp()
        })
        return loyaltyRef
      } catch (e) {
        console.error('Error adding document: ', e)
      }
    }

    async function upsertLoyalty(id: string, payload: any) {
      const userRef = await doc(db, 'loyalties', id)
      try {
        await updateDoc(userRef, payload)
      } catch (e) {
        console.error('Error updating document: ', e)
      }
    }

    async function deleteLoyalty(id: string) {
      const userRef = doc(db, 'users', id)
      try {
        await deleteDoc(userRef)
      } catch (e) {
        console.error('Error deleting document: ', e)
      }
    }

    function clearUnsubcribes() {
      unsubscribes.value.forEach((unsubcribe: Unsubscribe) => unsubcribe())
      unsubscribes.value = []
    }

    return {
      loyalties,
      fetchLoyalties,
      createLoyalty,
      upsertLoyalty,
      deleteLoyalty,
      clearUnsubcribes
    }
  },
  { historyEnabled: false }
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLoyaltyStore, import.meta.hot))
}
