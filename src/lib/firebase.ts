import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyCqMPqO9t8GLTQhRbcSbWk_SMrVJCkZUOE',
  authDomain: 'loginhealthcare-e809b.firebaseapp.com',
  projectId: 'loginhealthcare-e809b',
  storageBucket: 'loginhealthcare-e809b.firebasestorage.app',
  messagingSenderId: '314832062013',
  appId: '1:314832062013:web:25de395071a8b949ddcc54',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export default app
