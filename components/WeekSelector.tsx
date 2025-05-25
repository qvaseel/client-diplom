import { ChevronLeft, ChevronRight } from 'lucide-react'

type Props = {
  date: Date
  onChange: (date: Date) => void
}

export default function WeekSelector({ date, onChange }: Props) {
  const handlePrevWeek = () => {
    const prev = new Date(date)
    prev.setDate(prev.getDate() - 7)
    onChange(prev)
  }

  const handleNextWeek = () => {
    const next = new Date(date)
    next.setDate(next.getDate() + 7)
    onChange(next)
  }

  return (
    <div className="flex items-center justify-between max-w-md mx-auto">
      <button onClick={handlePrevWeek} className="p-2 hover:bg-gray-100 rounded-full">
        <ChevronLeft />
      </button>
      <span className="font-medium">
        Неделя: {date.toLocaleDateString()}
      </span>
      <button onClick={handleNextWeek} className="p-2 hover:bg-gray-100 rounded-full">
        <ChevronRight />
      </button>
    </div>
  )
}
