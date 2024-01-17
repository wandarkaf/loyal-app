import { ref } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { db, collection } from '@/firebase'
import { useGeolocation } from '@/composables/useGeolocation'

import type { DocumentData, Unsubscribe } from 'firebase/firestore'
import {
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  query,
  where,
  documentId
} from 'firebase/firestore'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

import { useAuthStore } from './AuthStore'
import { useFileUpload } from '@/composables/useFileUpload'

import type { coordinates } from '@/types'

export const useCardStore = defineStore(
  'CardStore',
  () => {
    // state
    const card = ref<DocumentData>({})
    const cards = ref<DocumentData>([])
    const unsubscribes = ref<Unsubscribe[]>([])

    const authStore = useAuthStore()
    const { distanceBetween } = useGeolocation()
    const { filesToUpload } = useFileUpload()

    async function fetchCard(id: string) {
      const cardRef = await getDoc(doc(db, `cards/${id}`))
      const cardObject = { id: cardRef.id, ...cardRef.data() }
      card.value = cardObject
      return cardObject
    }

    async function fetchAllCards() {
      const unsubscribe = onSnapshot(collection(db, 'cards'), (doc) => {
        cards.value = doc.docs.map((doc) => {
          return { id: doc.id, ...doc.data() }
        })
      })
      unsubscribes.value = [...unsubscribes.value, unsubscribe]
    }

    async function fetchCardsByLocation({ center }: { center: coordinates }) {
      const unsubscribe = onSnapshot(collection(db, 'cards'), (doc) => {
        const cardDistanceArray = doc.docs.map((doc) => {
          const lat = doc.data().location.lat
          const lng = doc.data().location.lng
          const distanceInKm = distanceBetween({ lat, lng, center })
          const distanceInM = distanceInKm * 1000
          if (distanceInM <= 2 * 1000) {
            return { id: doc.id, ...doc.data(), distanceInM }
          }
        })

        cards.value = cardDistanceArray.sort((a: any, b: any) => a.distanceInM - b.distanceInM)
      })
      unsubscribes.value = [...unsubscribes.value, unsubscribe]
    }

    async function fetchCards(ids: string[] | null) {
      const unsubscribe = onSnapshot(
        query(collection(db, 'cards'), where(documentId(), 'in', ids)),
        (doc) => {
          cards.value = doc.docs.map((doc) => {
            return { id: doc.id, ...doc.data() }
          })
        }
      )
      unsubscribes.value = [...unsubscribes.value, unsubscribe]

      return cards.value
    }

    async function createCard(payload: any) {
      try {
        if (filesToUpload.value) {
          const uploadFiles = await Promise.all(
            filesToUpload.value.map((file: any) => uploadImage(file))
          )
          uploadFiles.forEach((image: any) => {
            payload.style[image.key] = image.downloadURL
          })
          filesToUpload.value = []
        }
        const cardRef = await addDoc(collection(db, 'cards'), {
          ...payload,
          users: [],
          loyalties: [],
          createdAt: serverTimestamp()
        })
        return cardRef
      } catch (e) {
        console.error('Error adding document: ', e)
      }
    }

    async function uploadImage({ key, blob }: { key: string; blob: any }) {
      const storage = getStorage()
      const storageReference = storageRef(
        storage,
        `uploads/${authStore.authUser?.uid}/images/${Date.now()}-${blob.name}`
      )
      const uploadTask = await uploadBytes(storageReference, blob)
      const downloadURL = await getDownloadURL(uploadTask.ref)

      return { key, downloadURL }
    }

    async function upsertCard(id: string, payload: any) {
      try {
        const cardRef = await doc(db, 'cards', id)
        if (filesToUpload.value) {
          const uploadFiles = await Promise.all(
            filesToUpload.value.map((file: any) => uploadImage(file))
          )
          uploadFiles.forEach((image: any) => {
            if (image.key === 'icon') {
              payload.location[image.key] = image.downloadURL
            }
            if (image.key === 'logo') {
              payload[image.key] = image.downloadURL
            } else {
              payload.style[image.key] = image.downloadURL
            }
          })
          filesToUpload.value = []
        }
        await updateDoc(cardRef, { ...payload })
        card.value = { ...card.value, ...payload }
      } catch (e) {
        console.error('Error updating document: ', e)
      }
    }

    async function deleteCard(id: string) {
      const userRef = doc(db, 'users', id)
      try {
        await deleteDoc(userRef)
        // users.value = users.value.filter((user: any) => user.id !== id)
      } catch (e) {
        console.error('Error deleting document: ', e)
      }
    }

    function clearUnsubcribes() {
      unsubscribes.value.forEach((unsubcribe: Unsubscribe) => unsubcribe())
      unsubscribes.value = []
    }

    return {
      card,
      cards,
      fetchCard,
      fetchCards,
      fetchAllCards,
      fetchCardsByLocation,
      createCard,
      upsertCard,
      deleteCard,
      clearUnsubcribes
    }
  },
  { historyEnabled: false }
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCardStore, import.meta.hot))
}
