import { dbService } from '../services/DatabaseService'
import { parseISO, isWithinInterval } from 'date-fns'

export const addService = async (selectedService, openDetailRepairModal) => {
    if (
        selectedService !== null &&
        !openDetailRepairModal.data.repairRegisters.some(
            (item) => item.service.id === selectedService.id
        )
    ) {
        const newData = {
            status: 'Đang sửa chữa',
            serviceId: selectedService.id,
            employeeIds: [],
            repairRegisterComponents: []
        }
        const newRepairRegister = await dbService.add('repairregisters', newData)
        await dbService.updateFields('serviceregisters', openDetailRepairModal.data.id, {
            repairRegisterIds: [
                ...openDetailRepairModal.data.repairRegisterIds,
                newRepairRegister.id
            ]
        })
    }
}

export const deleteService = async (serviceId, openDetailRepairModal) => {
    // Xóa một repairRegister mới và thêm vào registerService
    if (serviceId) {
        const repairRegister = openDetailRepairModal.data?.repairRegisters?.find(
            (item) => item.service.id === serviceId
        )
        await dbService.delete('repairregisters', repairRegister.id)
        // Cập nhật registerService
        await dbService.updateFields('serviceregisters', openDetailRepairModal.data.id, {
            repairRegisterIds: openDetailRepairModal.data.repairRegisterIds.filter(
                (id) => id !== repairRegister.id
            )
        })
    }
}

export const completeService = async (serviceId, openDetailRepairModal, fetchData) => {
    if (serviceId) {
        await dbService.updateFields(
            'repairregisters',
            openDetailRepairModal.data?.repairRegisters?.find(
                (item) => item.service.id === serviceId
            ).id,
            {
                status: 'Đã hoàn thành'
            }
        )
        await fetchData()
    }
}

export const addComponentUsed = async (
    repairComponents,
    serviceId,
    openDetailRepairModal,
    fetchData
) => {
    if (repairComponents && serviceId) {
        await dbService.updateFields(
            'repairregisters',
            openDetailRepairModal.data.repairRegisters.find((item) => item.service.id === serviceId)
                .id,
            {
                repairRegisterComponents: [
                    ...repairComponents.map((item) => ({
                        componentId: item.component.id,
                        quantity: item.quantity
                    }))
                ]
            }
        )
        await fetchData()
    }
}

export const addStaffInCharge = async (employees, serviceId, openDetailRepairModal, fetchData) => {
    if (employees && serviceId) {
        await dbService.updateFields(
            'repairregisters',
            openDetailRepairModal.data.repairRegisters.find((item) => item.service.id === serviceId)
                .id,
            {
                employeeIds: [...employees.map((item) => item.id)]
            }
        )
        await fetchData()
    }
}

export const getRepairRegisterByDate = async (startDate, endDate) => {
    const repairRegister = await dbService.getAll('repairregisters')

    const parsedStartDate = new Date(startDate)
    const parsedEndDate = new Date(endDate)
    const filteredData = repairRegister.filter((item) => {
        const itemDate = parseISO(item.createdAt)
        return isWithinInterval(itemDate, {
            start: parsedStartDate,
            end: parsedEndDate
        })
    })
    return filteredData
}
