import { ref } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { db, collection } from '@/firebase'
import type { DocumentData, Unsubscribe } from 'firebase/firestore'
import { doc, setDoc, updateDoc, deleteDoc, onSnapshot, serverTimestamp } from 'firebase/firestore'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

export const useUserStore = defineStore(
  'UserStore',
  () => {
    // state
    const authId = ref<string | null>(null)
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

    function fetchAuthUser(id: string) {
      authId.value = id
    }

    async function registerUserWithEmailAndPassword(payload: any) {
      const auth = getAuth()
      const result = await createUserWithEmailAndPassword(auth, payload.email, payload.password)
      createUser({ id: result.user.uid, ...payload })
      fetchAuthUser(result.user.uid)
    }

    async function createUser(payload: any) {
      try {
        console.log('payload', payload)
        const usernameLower = payload.username.toLowerCase()
        const userRef = await setDoc(doc(db, 'users', payload.id), {
          ...payload,
          usernameLower,
          registerAt: serverTimestamp(),
          email: payload.email.toLowerCase()
        })
        users.value = [...users.value.map((user: any) => user), { ...payload }]
        console.log(userRef)
        return userRef
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

    return {
      users,
      authId,
      fetchUsers,
      createUser,
      upsertUser,
      deleteUser,
      clearUnsubcribes,
      registerUserWithEmailAndPassword,
      fetchAuthUser
    }
  },
  { historyEnabled: false }
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
}
