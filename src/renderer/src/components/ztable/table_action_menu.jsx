import React, { useState } from 'react'
import { MoreVertical, Pencil, Trash } from 'lucide-react'

const TableActionsMenu = ({ onEdit, onDelete }) => {
    const [isOpen, setIsOpen] = useState(false)

    const handleAction = (callback) => {
        setIsOpen(false)
        callback?.()
    }

    return (
        <td className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-gray-100 rounded-full"
            >
                <MoreVertical className="h-4 w-4 text-gray-600" />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 py-1">
                        <button
                            onClick={() => handleAction(onEdit)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                        </button>
                        <button
                            onClick={() => handleAction(onDelete)}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                        </button>
                    </div>
                </>
            )}
        </td>
    )
}

export default TableActionsMenu
