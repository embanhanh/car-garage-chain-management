import { db } from '../firebase.config'
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    getDoc
} from 'firebase/firestore'
import { User } from '../models/user'
import { Customer } from '../models/customer'
import { Employee } from '../models/employee'

class DatabaseService {
    static instance = null

    constructor() {
        if (DatabaseService.instance) {
            return DatabaseService.instance
        }
        DatabaseService.instance = this

        // Định nghĩa các collection
        this.collections = {
            users: {
                name: 'users',
                model: User
            },
            customers: {
                name: 'customers',
                model: Customer
            },
            cars: 'cars',
            employees: {
                name: 'employees',
                model: Employee
            },
            repairregisters: 'repairregisters',
            components: 'components',
            bills: 'bills',
            services: 'services',
            inputcomponentregisters: 'inputcomponentregisters',
            garages: 'garages',
            categories: 'categories',
            suppliers: 'suppliers',
            serviceregisters: 'serviceregisters',
            trackingregisters: 'trackingregisters',
            servicetypes: 'servicetypes'
        }
    }

    async getById(collectionName, id) {
        try {
            const docRef = doc(db, this.collections[collectionName].name, id)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                return this.collections[collectionName].model.fromFirestore({
                    id: docSnap.id,
                    ...docSnap.data()
                })
            }
            return null
        } catch (error) {
            console.error(`Lỗi khi lấy document ${id} từ ${collectionName}:`, error)
            throw error
        }
    }

    async populate(data, relations) {
        try {
            const populatedData = { ...data }

            for (const field of relations) {
                if (data[field.foreignKey]) {
                    const relatedDoc = await this.getById(field.collection, data[field.foreignKey])
                    populatedData[field.as || field.collection] = relatedDoc
                }
            }

            return populatedData
        } catch (error) {
            console.error('Lỗi khi populate dữ liệu:', error)
            throw error
        }
    }

    async getAll(collectionName) {
        try {
            const ModelClass = this.collections[collectionName].model
            const querySnapshot = await getDocs(
                collection(db, this.collections[collectionName].name)
            )

            // Lấy dữ liệu cơ bản
            const docs = querySnapshot.docs.map((doc) =>
                ModelClass.fromFirestore({
                    id: doc.id,
                    ...doc.data()
                })
            )

            // Kiểm tra xem model có định nghĩa relations không
            if (ModelClass.relations && ModelClass.relations.length > 0) {
                return Promise.all(docs.map((doc) => this.populate(doc, ModelClass.relations)))
            }

            return docs
        } catch (error) {
            console.error(`Lỗi khi lấy dữ liệu ${collectionName}:`, error)
            throw error
        }
    }

    async add(collectionName, data) {
        try {
            const docRef = await addDoc(collection(db, this.collections[collectionName].name), data)
            return {
                id: docRef.id,
                ...data
            }
        } catch (error) {
            console.error(`Lỗi khi thêm ${collectionName}:`, error)
            throw error
        }
    }

    async update(collectionName, id, data) {
        try {
            const docRef = doc(db, this.collections[collectionName].name, id)
            await updateDoc(docRef, data)
            return {
                id,
                ...data
            }
        } catch (error) {
            console.error(`Lỗi khi cập nhật ${collectionName}:`, error)
            throw error
        }
    }

    async delete(collectionName, id) {
        try {
            await deleteDoc(doc(db, this.collections[collectionName].name, id))
            return id
        } catch (error) {
            console.error(`Lỗi khi xóa ${collectionName}:`, error)
            throw error
        }
    }

    // async findBy(collectionName, field, value) {
    //     try {
    //         const q = query(collection(db, collectionName), where(field, '==', value))
    //         const querySnapshot = await getDocs(q)
    //         return querySnapshot.docs.map((doc) => ({
    //             id: doc.id,
    //             ...doc.data()
    //         }))
    //     } catch (error) {
    //         console.error(`Lỗi khi tìm kiếm ${collectionName}:`, error)
    //         throw error
    //     }
    // }
}

export const dbService = new DatabaseService()
