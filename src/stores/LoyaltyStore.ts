import { ref } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { db, collection } from '@/firebase'
import type { DocumentData, Unsubscribe } from 'firebase/firestore'
import {
  doc,
  addDoc,
  // getDoc,
  // setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  query,
  where,
  documentId
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

    async function fetchLoyalties(ids: string[] | null) {
      try {
        const loyaltyQuery = await query(
          collection(db, 'loyalties'),
          where(documentId(), 'in', ids)
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

    async function fetchLoyaltiesByCardId(cardId: string) {
      const card = await cardStore.fetchCard(cardId)
      await userStore.fetchUsers(card?.users)
      await fetchLoyalties(card?.loyalties)
    }

    async function createLoyalty(payload: any) {
      try {
        const loyaltyRef = await addDoc(collection(db, 'loyalties'), {
          ...payload,
          stamps: 0,
          canBeClaimed: false,
          isClaimed: false,
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
      fetchLoyaltiesByCardId,
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
