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
    getDoc,
    setDoc
} from 'firebase/firestore'
import { User } from '../models/user'
import { Customer } from '../models/customer'
import { Employee } from '../models/employee'
import { Car } from '../models/car'
import { RepairRegister } from '../models/repairregister'
import { Component } from '../models/component'
import { Bill } from '../models/bill'
import { Service } from '../models/service'
import { InputComponentRegister } from '../models/inputcomponentregister'
import { Garage } from '../models/garage'
import { Category } from '../models/category'
import { Supplier } from '../models/supplier'
import { ServiceRegister } from '../models/serviceregister'
import { ServiceType } from '../models/servicetype'
import { TrackingRegister } from '../models/trackingregister'
import { Notification } from '../models/notification'

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
            cars: {
                name: 'cars',
                model: Car
            },
            employees: {
                name: 'employees',
                model: Employee
            },
            repairregisters: {
                name: 'repairregisters',
                model: RepairRegister
            },
            components: {
                name: 'components',
                model: Component
            },
            bills: {
                name: 'bills',
                model: Bill
            },
            services: {
                name: 'services',
                model: Service
            },
            inputcomponentregisters: {
                name: 'inputcomponentregisters',
                model: InputComponentRegister
            },
            garages: {
                name: 'garages',
                model: Garage
            },
            categories: {
                name: 'categories',
                model: Category
            },
            suppliers: {
                name: 'suppliers',
                model: Supplier
            },
            serviceregisters: {
                name: 'serviceregisters',
                model: ServiceRegister
            },
            servicetypes: {
                name: 'servicetypes',
                model: ServiceType
            },
            trackingregisters: {
                name: 'trackingregisters',
                model: TrackingRegister
            },
            notifications: {
                name: 'notifications',
                model: Notification
            }
        }
    }

    async getById(collectionName, id) {
        try {
            const docRef = doc(db, this.collections[collectionName].name, id)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                const data = docSnap.data()
                if (data.isDeleted) {
                    return null
                }
                const modelData = this.collections[collectionName].model.fromFirestore({
                    id: docSnap.id,
                    ...data
                })
                if (
                    this.collections[collectionName].model.relations &&
                    this.collections[collectionName].model.relations.length > 0
                ) {
                    return await this.populate(
                        modelData,
                        this.collections[collectionName].model.relations
                    )
                }
                return modelData
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
                if (field.isArray && field.arrayPath) {
                    if (Array.isArray(data[field.arrayPath]) && data[field.arrayPath].length > 0) {
                        const ids = data[field.arrayPath].map((item) => item[field.idField])

                        const relatedDocs = await this.findBy(field.collection, [
                            {
                                field: 'id',
                                operator: 'in',
                                value: ids
                            }
                        ])

                        populatedData[field.arrayPath] = data[field.arrayPath].map((item) => {
                            const relatedDoc = relatedDocs.find(
                                (doc) => doc.id === item[field.idField]
                            )
                            return {
                                ...item,
                                [field.as || field.collection]: relatedDoc
                            }
                        })
                    }
                } else if (field.isArray) {
                    if (
                        Array.isArray(data[field.foreignKey]) &&
                        data[field.foreignKey].length > 0
                    ) {
                        const relatedDocs = await this.findBy(field.collection, [
                            {
                                field: 'id',
                                operator: 'in',
                                value: data[field.foreignKey]
                            }
                        ])
                        populatedData[field.as || field.collection] = relatedDocs
                    }
                } else if (data[field.foreignKey]) {
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

    async getAll(collectionName, garageId = null) {
        try {
            const ModelClass = this.collections[collectionName].model

            // Nếu có trường isDeleted, thêm điều kiện vào truy vấn
            const q = query(
                collection(db, this.collections[collectionName].name),
                where('isDeleted', '!=', true)
            )
            const querySnapshot = await getDocs(q)
            const docs = querySnapshot.docs
                .map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }))
                .filter((doc) => !doc.isDeleted) // Lọc isDeleted
                .filter((doc) => !garageId || doc.garageId === garageId) // Lọc theo garageId nếu có
                .map((doc) => ModelClass.fromFirestore(doc))

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
            const docRef = await addDoc(collection(db, this.collections[collectionName].name), {
                ...data,
                createdAt: new Date().toISOString(),
                isDeleted: false
            })
            await updateDoc(docRef, { id: docRef.id })
            return {
                id: docRef.id,
                ...data
            }
        } catch (error) {
            console.error(`Lỗi khi thêm ${collectionName}:`, error)
            throw error
        }
    }

    async addWithId(collectionName, id, data) {
        try {
            const docRef = doc(db, this.collections[collectionName].name, id)
            await setDoc(docRef, {
                ...data,
                id: id,
                createdAt: new Date().toISOString(),
                isDeleted: false
            })
            return {
                id,
                ...data
            }
        } catch (error) {
            console.error(`Lỗi khi thêm ${collectionName} với ID ${id}:`, error)
            throw error
        }
    }

    async update(collectionName, id, data) {
        try {
            const docRef = doc(db, this.collections[collectionName].name, id)
            const newData = await updateDoc(docRef, data)
            return {
                id,
                ...newData
            }
        } catch (error) {
            console.error(`Lỗi khi cập nhật ${collectionName}:`, error)
            throw error
        }
    }

    async updateFields(collectionName, id, updatedFields) {
        try {
            const docRef = doc(db, this.collections[collectionName].name, id)
            const currentDocSnap = await getDoc(docRef)

            if (!currentDocSnap.exists()) {
                throw new Error(
                    `Document với ID "${id}" không tồn tại trong collection "${collectionName}"`
                )
            }

            const currentData = currentDocSnap.data()

            const newData = { ...currentData, ...updatedFields }

            await updateDoc(docRef, newData)

            return {
                id,
                ...newData
            }
        } catch (error) {
            console.error(
                `Lỗi khi cập nhật các trường trong ${collectionName} với ID ${id}:`,
                error
            )
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

    async softDelete(collectionName, id) {
        try {
            const docRef = doc(db, this.collections[collectionName].name, id)

            // Lấy dữ liệu hiện tại
            const docSnap = await getDoc(docRef)
            if (!docSnap.exists()) {
                throw new Error(`Không tìm thấy document với id ${id}`)
            }

            const currentData = docSnap.data()

            // Cập nhật với dữ liệu cũ + thêm các trường mới
            await updateDoc(docRef, {
                ...currentData,
                deletedAt: new Date().toISOString(),
                isDeleted: true
            })

            return {
                id,
                ...currentData,
                deletedAt: new Date().toISOString(),
                isDeleted: true
            }
        } catch (error) {
            console.error(`Lỗi khi xóa mềm ${collectionName}:`, error)
            throw error
        }
    }

    async findBy(collectionName, conditions = [], options = {}) {
        try {
            const ModelClass = this.collections[collectionName].model
            let q = collection(db, this.collections[collectionName].name)
            const queryConstraints = []
            // Thêm các điều kiện tìm kiếm
            conditions.forEach((condition) => {
                switch (condition.operator) {
                    case '==':
                    case '!=':
                    case '<':
                    case '<=':
                    case '>':
                    case '>=':
                    case 'array-contains':
                    case 'array-contains-any':
                    case 'in':
                    case 'not-in':
                        queryConstraints.push(
                            where(condition.field, condition.operator, condition.value)
                        )
                        break
                    case 'between':
                        // Xử lý trường hợp between
                        if (Array.isArray(condition.value) && condition.value.length === 2) {
                            queryConstraints.push(
                                where(condition.field, '>=', condition.value[0]),
                                where(condition.field, '<=', condition.value[1])
                            )
                        }
                        break
                    default:
                        console.warn(`Toán tử không được hỗ trợ: ${condition.operator}`)
                }
            })

            // Thêm sắp xếp
            if (options.orderBy) {
                options.orderBy.forEach((order) => {
                    queryConstraints.push(orderBy(order.field, order.direction || 'asc'))
                })
            }

            // Thêm phân trang
            if (options.limit) {
                queryConstraints.push(limit(options.limit))
            }

            if (options.startAfter) {
                queryConstraints.push(startAfter(options.startAfter))
            }

            if (options.endBefore) {
                queryConstraints.push(endBefore(options.endBefore))
            }

            // Tạo query với tất cả các điều kiện
            q = query(q, ...queryConstraints)

            // Thực hiện query
            const querySnapshot = await getDocs(q)

            const finalSnapshot = querySnapshot.docs.filter((doc) => !doc.data().isDeleted)

            // Chuyển đổi kết quả thành instances của model
            const docs = finalSnapshot.map((doc) =>
                ModelClass.fromFirestore({
                    id: doc.id,
                    ...doc.data()
                })
            )

            // Populate relations nếu cần
            if (ModelClass.relations && ModelClass.relations.length > 0) {
                return Promise.all(docs.map((doc) => this.populate(doc, ModelClass.relations)))
            }

            return docs
        } catch (error) {
            console.error(`Lỗi khi tìm kiếm ${collectionName}:`, error)
            throw error
        }
    }
}

export const dbService = new DatabaseService()
