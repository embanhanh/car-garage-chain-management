import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase.config'

export const getParameters = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'parameters'))
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))
    } catch (error) {
        console.error('Error getting parameters:', error)
        return []
    }
} 