import { ref } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { db } from '@/firebase'
import { doc, getDoc } from 'firebase/firestore'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from 'firebase/auth'
import type { User } from 'firebase/auth'
import type { Unsubscribe } from 'firebase/firestore'

import { useUserStore } from '@/stores/UserStore'

export const useAuthStore = defineStore(
  'AuthStore',
  () => {
    const userStore = useUserStore()
    const authUser = ref<(User & { cards?: number[]; loyalties?: number[] }) | null>(null)
    const authUserUnsubscribe = ref<Unsubscribe | null>(null)
    const authObserverUnsubscribe = ref<Unsubscribe | null>(null)

    function initAuthentication() {
      if (authObserverUnsubscribe.value) return
      return new Promise((resolve) => {
        const auth = getAuth()
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          console.log('👣 the user has changed')
          authObserverUnsubscribe.value = unsubscribe

          if (user) {
            await fetchAuthUser(user)
            resolve(user)
          } else {
            resolve(null)
          }
        })
        authObserverUnsubscribe.value = unsubscribe
      })
    }

    async function fetchAuthUser(payload: User | null) {
      if (!payload) {
        authUser.value = payload
      } else {
        const collectionUser = await userStore.fetchUser(payload?.uid || '')
        authUser.value = { ...payload, ...collectionUser }
      }
    }

    async function registerUserWithEmailAndPassword(payload: any) {
      const auth = getAuth()
      const result = await createUserWithEmailAndPassword(auth, payload.email, payload.password)
      await userStore.createUser({ id: result.user.uid, ...payload })
      fetchAuthUser(result.user)
    }

    async function signInUser({ email, password }: { email: string; password: string }) {
      const auth = getAuth()
      await signInWithEmailAndPassword(auth, email, password)
    }
    async function signOutUser() {
      const auth = getAuth()
      await signOut(auth)
      fetchAuthUser(null)
    }

    async function signInWithGoogle() {
      const auth = getAuth()
      const provider = new GoogleAuthProvider()
      const response = await signInWithPopup(auth, provider)
      const user = response.user

      // check if user exists in db
      const userRef = await getDoc(doc(db, 'users', user.uid))
      if (!userRef.exists()) {
        userStore.createUser({
          id: user.uid,
          username: user.displayName,
          email: user.email,
          avatar: user.photoURL
        })
      } else {
        userStore.upsertUser(user.uid, { avatar: user.photoURL, email: user.email })
      }
    }

    async function unsubscribeAuthUserSnapshot() {
      if (authUserUnsubscribe.value) {
        authUserUnsubscribe.value()
        authUserUnsubscribe.value = null
      }
    }

    return {
      authUser,
      initAuthentication,
      fetchAuthUser,
      registerUserWithEmailAndPassword,
      signInUser,
      signOutUser,
      signInWithGoogle,
      unsubscribeAuthUserSnapshot
    }
  },
  { historyEnabled: false }
)

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
