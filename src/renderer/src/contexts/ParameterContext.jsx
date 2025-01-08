import { createContext, useState, useContext, useEffect } from 'react'
import { dbService } from '../services/DatabaseService'
import { onSnapshot, collection } from 'firebase/firestore'
import { db } from '../firebase.config'

const ParameterContext = createContext()

export function ParameterProvider({ children }) {
    const [parameters, setParameters] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchParameters = async () => {
            try {
                const data = await dbService.getAll('parameters')
                setParameters(data)
            } catch (error) {
                console.error('Lỗi khi lấy parameters:', error)
            } finally {
                setIsLoading(false)
            }
        }

        // Lắng nghe thay đổi từ Firestore
        const unsubscribe = onSnapshot(collection(db, 'parameters'), fetchParameters)

        return () => unsubscribe()
    }, [])

    const updateParameter = async (id, value) => {
        try {
            await dbService.update('parameters', id, { value })
        } catch (error) {
            console.error('Lỗi khi cập nhật parameter:', error)
            throw error
        }
    }

    return (
        <ParameterContext.Provider value={{ parameters, isLoading, updateParameter }}>
            {children}
        </ParameterContext.Provider>
    )
}

// Custom hook để sử dụng parameters
export function useParameters() {
    const context = useContext(ParameterContext)
    if (!context) {
        throw new Error('useParameters phải được sử dụng trong ParameterProvider')
    }
    return context
}
