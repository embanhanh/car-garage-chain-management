import { increment } from 'firebase/firestore'
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
        await dbService.update('serviceregisters', openDetailRepairModal.data.id, {
            repairRegisterIds: [
                ...openDetailRepairModal.data.repairRegisterIds,
                newRepairRegister.id
            ]
        })
        if (openDetailRepairModal.data.status == 'Đã hoàn thành') {
            await dbService.update('serviceregisters', openDetailRepairModal.data.id, {
                status: 'Đang sửa chữa'
            })
        }
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
        await dbService.update('serviceregisters', openDetailRepairModal.data.id, {
            repairRegisterIds: openDetailRepairModal.data.repairRegisterIds.filter(
                (id) => id !== repairRegister.id
            )
        })
        if (
            !openDetailRepairModal.data.repairRegisters
                .filter((item) => item.service.id !== serviceId)
                .some((item) => item.status == 'Đang sửa chữa')
        ) {
            await dbService.update('serviceregisters', openDetailRepairModal.data.id, {
                status: 'Đã hoàn thành'
            })
        }
    }
}

export const completeService = async (serviceId, openDetailRepairModal, fetchData) => {
    if (serviceId) {
        await dbService.update(
            'repairregisters',
            openDetailRepairModal.data?.repairRegisters?.find(
                (item) => item.service.id === serviceId
            ).id,
            {
                status: 'Đã hoàn thành'
            }
        )
        openDetailRepairModal.data?.repairRegisters
            ?.find((item) => item.service.id === serviceId)
            .repairRegisterComponents.forEach(async (item) => {
                await dbService.update('components', item.component.id, {
                    inventory: increment(Number(item.quantity) * -1)
                })
            })
        if (
            !openDetailRepairModal.data.repairRegisters
                .filter((item) => item.service.id !== serviceId)
                .some((item) => item.status == 'Đang sửa chữa')
        ) {
            await dbService.update('serviceregisters', openDetailRepairModal.data.id, {
                status: 'Đã hoàn thành'
            })
        }
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

export const getRepairRegisterByGarageId = async (garageId, startDate, endDate) => {
    const repairRegister = await dbService.getAll('repairregisters', garageId)

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

export const getRecentRepairRegisters = async () => {
    const repairRegisters = await dbService.getAll('repairregisters')
    console.log('check repairRegisters:', repairRegisters)
    return repairRegisters.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
}
