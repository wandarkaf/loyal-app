import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { firebaseConfig } from '@/config/firebase'

const app = initializeApp(firebaseConfig)

const db = getFirestore(app)
const storage = getStorage(app)

export { db, storage, collection, getDocs }
