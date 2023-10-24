import { ref } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { db, collection } from '@/firebase'
import type { DocumentData, Unsubscribe } from 'firebase/firestore'
import { doc, addDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore'

export const useUserStore = defineStore(
  'UserStore',
  () => {
    // state
    const users = ref<DocumentData>([])
    const unsubscribes = ref<Unsubscribe[]>([])

    async function fetchUsers() {
      const unsubscribe = onSnapshot(collection(db, 'users'), (doc) => {
        console.log('Current data for users')
        users.value = doc.docs.map((doc) => {
          return { id: doc.id, ...doc.data() }
        })
      })
      unsubscribes.value = [...unsubscribes.value, unsubscribe]
    }

    async function createUser(payload: any) {
      try {
        const userRef = await addDoc(collection(db, 'users'), payload)
        console.log('Document written with ID: ', userRef.id)
        users.value = [...users.value.map((user: any) => user), { id: userRef.id, ...payload }]
      } catch (e) {
        console.error('Error adding document: ', e)
      }
    }

    async function upsertUser(id: string, payload: any) {
      const userRef = doc(db, 'users', id)
      try {
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

    return { users, fetchUsers, createUser, upsertUser, deleteUser, clearUnsubcribes }
  },
  { historyEnabled: false }
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
