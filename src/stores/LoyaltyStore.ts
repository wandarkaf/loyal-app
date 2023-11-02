import { ref } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { db, collection } from '@/firebase'
import type { DocumentData, Unsubscribe } from 'firebase/firestore'
import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  query,
  where
} from 'firebase/firestore'

export const useLoyatyStore = defineStore(
  'LoyaltyStore',
  () => {
    // state
    const loyalties = ref<DocumentData>([])
    const unsubscribes = ref<Unsubscribe[]>([])
    // const loyaltyCardsIds = ref<string[]>([])

    async function fetchLoyalties(userId: string) {
      const loyaltyQuery = await query(collection(db, 'loyalties'), where('userId', '==', userId))

      const unsubscribe = onSnapshot(loyaltyQuery, async (queryDocuments) => {
        loyalties.value = await queryDocuments.docs.map((document) => {
          // const cardDocumentRef = doc(db, 'cards', document.data().cardId)
          // const cardDocument = await getDoc(cardDocumentRef)
          // loyaltyCardsIds.value = [...loyaltyCardsIds.value, document.data().cardId]

          if (document.exists()) {
            // return { id: document.id, ...document.data(), card: cardDocument.data() }
            return { id: document.id, ...document.data() }
          }
          return null
        })
      })

      // console.log('loyaltyCardsIds', loyaltyCardsIds.value)
      unsubscribes.value = [...unsubscribes.value, unsubscribe]
    }

    async function createLoyalty(payload: any) {
      try {
        const usernameLower = payload.username.toLowerCase()
        const userRef = await setDoc(doc(db, 'users', payload.id), {
          ...payload,
          usernameLower,
          registerAt: serverTimestamp(),
          email: payload.email.toLowerCase()
        })
        return userRef
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
  import.meta.hot.accept(acceptHMRUpdate(useLoyatyStore, import.meta.hot))
}
