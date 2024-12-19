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
            }
        }
    }

    async getById(collectionName, id) {
        try {
            const docRef = doc(db, this.collections[collectionName].name, id)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                const data = this.collections[collectionName].model.fromFirestore({
                    id: docSnap.id,
                    ...docSnap.data()
                })
                if (
                    this.collections[collectionName].model.relations &&
                    this.collections[collectionName].model.relations.length > 0
                ) {
                    return await this.populate(
                        data,
                        this.collections[collectionName].model.relations
                    )
                }
                return data
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

    async findBy(collectionName, conditions = [], options = {}) {
        try {
            const ModelClass = this.collections[collectionName].model
            let q = collection(db, this.collections[collectionName].name)

            // Tạo mảng các điều kiện query
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

            // Chuyển đổi kết quả thành instances của model
            const docs = querySnapshot.docs.map((doc) =>
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
