import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../firebase.config'
import { Brand } from '../models/brand'

export const getBrands = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'brands'))
        return querySnapshot.docs.map((doc) => {
            const data = doc.data()
            data.id = doc.id
            return Brand.fromFirestore(data)
        })
    } catch (error) {
        console.error('Lỗi khi lấy danh sách hãng xe:', error)
        throw error
    }
}

export const addBrand = async (brandData) => {
    try {
        const docRef = await addDoc(collection(db, 'brands'), brandData.toFirestore())
        return docRef.id
    } catch (error) {
        console.error('Lỗi khi thêm hãng xe:', error)
        throw error
    }
}

export const updateBrand = async (id, brandData) => {
    try {
        const brandRef = doc(db, 'brands', id)
        await updateDoc(brandRef, brandData.toFirestore())
    } catch (error) {
        console.error('Lỗi khi cập nhật hãng xe:', error)
        throw error
    }
}

export const deleteBrand = async (id) => {
    try {
        const brandRef = doc(db, 'brands', id)
        await deleteDoc(brandRef)
    } catch (error) {
        console.error('Lỗi khi xóa hãng xe:', error)
        throw error
    }
}
