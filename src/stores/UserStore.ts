import { ref } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { db, collection } from '@/firebase'
import type { DocumentData, Unsubscribe } from 'firebase/firestore'
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  documentId,
  query,
  where
} from 'firebase/firestore'

export const useUserStore = defineStore(
  'UserStore',
  () => {
    // state
    const users = ref<DocumentData>([])
    const unsubscribes = ref<Unsubscribe[]>([])

    async function fetchUsers(ids: string[] | null = null) {
      try {
        const userQuery =
          ids === null
            ? await collection(db, 'users')
            : await query(collection(db, 'users'), where(documentId(), 'in', ids))

        const unsubscribe = onSnapshot(userQuery, async (queryDocuments) => {
          users.value = await queryDocuments.docs.map((document) => {
            if (document.exists()) {
              return { id: document.id, ...document.data() }
            }
            return null
          })
        })
        unsubscribes.value = [...unsubscribes.value, unsubscribe]
      } catch (e) {
        console.error('Error getting document: ', e)
        users.value = []
      }
    }

    async function fetchUser(id: string) {
      const userRef = doc(db, 'users', id)
      const userDocument = await getDoc(userRef)
      return userDocument.data()
    }

    async function createUser(payload: any) {
      try {
        const usernameLower = payload.username.toLowerCase()
        const userRef = await setDoc(doc(db, 'users', payload.id), {
          ...payload,
          usernameLower,
          registerAt: serverTimestamp(),
          email: payload.email.toLowerCase()
        })
        users.value = [...users.value.map((user: any) => user), { ...payload }]
        return userRef
      } catch (e) {
        console.error('Error adding document: ', e)
      }
    }

    async function upsertUser(id: string, payload: any) {
      try {
        const userRef = await doc(db, 'users', id)
        await updateDoc(userRef, payload)
        let user = users.value.find((user: any) => user.id === id)
        user = { ...user, ...payload }
        users.value = [...users.value.filter((user: any) => user.id !== id), user]
      } catch (e) {
        console.error('Error updating document: ', e)
      }
    }

    async function deleteUser(id: string) {
      const userRef = doc(db, 'users', id)
      try {
        await deleteDoc(userRef)
        users.value = users.value.filter((user: any) => user.id !== id)
      } catch (e) {
        console.error('Error deleting document: ', e)
      }
    }

    function clearUnsubcribes() {
      unsubscribes.value.forEach((unsubcribe: Unsubscribe) => unsubcribe())
      unsubscribes.value = []
    }

    return {
      users,
      fetchUsers,
      fetchUser,
      createUser,
      upsertUser,
      deleteUser,
      clearUnsubcribes
    }
  },
  { historyEnabled: false }
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
