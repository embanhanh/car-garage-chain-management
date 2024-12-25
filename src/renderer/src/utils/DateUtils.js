import {
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    startOfYear,
    endOfYear,
    addDays,
    addMonths,
    addYears,
} from 'date-fns'

export const sameDay = (date1, date2) => {
    return (
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
    )
}

export const calculateDateDate = (dateRange, selectedDate) => {
    return dateRange === 'week'
        ? {
              now: {
                  start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
                  end: endOfWeek(selectedDate, { weekStartsOn: 1 }),
              },
              prev: {
                  start: startOfWeek(addDays(selectedDate, -7), { weekStartsOn: 1 }),
                  end: endOfWeek(addDays(selectedDate, -7), { weekStartsOn: 1 }),
              },
          }
        : dateRange === 'month'
        ? {
              now: {
                  start: startOfMonth(selectedDate),
                  end: endOfMonth(selectedDate),
              },
              prev: {
                  start: startOfMonth(addMonths(selectedDate, -1)),
                  end: endOfMonth(addMonths(selectedDate, -1)),
              },
          }
        : {
              now: {
                  start: startOfYear(selectedDate),
                  end: endOfYear(selectedDate),
              },
              prev: {
                  start: startOfYear(addYears(selectedDate, -1)),
                  end: endOfYear(addYears(selectedDate, -1)),
              },
          }
}

export function calculateDaysDifference(createdAt, deliveredAt) {
    const date1 = new Date(createdAt)
    const date2 = new Date(deliveredAt)

    const diffInMilliseconds = date2 - date1

    const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24)

    return Math.round(diffInDays * 10) / 10
}
