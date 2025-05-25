export function getStartOfWeek(date: Date): Date {
  const start = new Date(date)
  const day = start.getDay()
  const diff = start.getDate() - day + (day === 0 ? -6 : 1) // Monday
  start.setDate(diff)
  return new Date(start.setHours(0, 0, 0, 0))
}

export function getWeekDays(startDate: Date): Date[] {
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(startDate)
    d.setDate(d.getDate() + i)
    return d
  })
}
