import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { firebaseConfig } from '@/config/firebase'

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { auth, db, storage, collection, getDocs }
