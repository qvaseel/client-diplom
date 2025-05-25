'use client'

import { useEffect, useState } from 'react'


import { getStartOfWeek, getWeekDays } from '@/utils/date-utils'
import WeekSelector from '@/components/WeekSelector'
import DaySchedule from '@/components/DaySchedule'

export default function StudentDiaryPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [weekDays, setWeekDays] = useState<Date[]>([])

  useEffect(() => {
    const startOfWeek = getStartOfWeek(currentDate)
    setWeekDays(getWeekDays(startOfWeek))
  }, [currentDate])

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Дневник студента</h1>
      <WeekSelector date={currentDate} onChange={setCurrentDate} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {weekDays.map((day) => (
          <DaySchedule key={day.toISOString()} date={day.toString()} />
        ))}
      </div>
    </div>
  )
}
