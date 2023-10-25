import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { firebaseConfig } from '@/config/firebase'
import { useUserStore } from '@/stores/UserStore'

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    const userStore = useUserStore()
    userStore.fetchAuthUser(user.uid)
    // ...
  } else {
    // User is signed out
    // ...
  }
})

export { auth, db, storage, collection, getDocs }
