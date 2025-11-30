"use client"

import { Button } from "@/components/ui/button"
import { DAYS_OF_WEEK_LABELS } from "@/lib/validations/schedule"
import { Clock, Edit, Trash2 } from "lucide-react"

type Schedule = {
  id: number
  dayOfWeek: keyof typeof DAYS_OF_WEEK_LABELS
  startTime: string
  endTime: string
}

interface ScheduleCardProps {
  dayLabel: string
  schedules: Schedule[]
  onEdit: (schedule: Schedule) => void
  onDelete: (id: number) => void
}

export default function ScheduleCard({
  dayLabel,
  schedules,
  onEdit,
  onDelete
}: ScheduleCardProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-4 md:p-6">
      <h3 className="text-base md:text-lg font-semibold text-foreground mb-3 md:mb-4">
        {dayLabel}
      </h3>
      
      {schedules.length === 0 ? (
        <p className="text-muted-foreground text-xs md:text-sm">Nenhum horário definido</p>
      ) : (
        <div className="space-y-2 md:space-y-3">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 md:p-3 bg-gray-50 rounded-md gap-2 sm:gap-0"
            >
              <div className="flex items-center space-x-2 md:space-x-3">
                <Clock className="h-3 w-3 md:h-4 md:w-4 text-gray-400 flex-shrink-0" />
                <span className="text-xs md:text-sm font-medium">
                  {schedule.startTime} às {schedule.endTime}
                </span>
              </div>
              
              <div className="flex items-center space-x-1 md:space-x-2 ml-5 sm:ml-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(schedule)}
                  className="h-6 w-6 md:h-8 md:w-8 p-0"
                >
                  <Edit className="h-2 w-2 md:h-3 md:w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(schedule.id)}
                  className="text-red-600 hover:text-red-700 h-6 w-6 md:h-8 md:w-8 p-0"
                >
                  <Trash2 className="h-2 w-2 md:h-3 md:w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
