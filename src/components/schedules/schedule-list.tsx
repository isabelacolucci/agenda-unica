"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-toastify"
import { DAYS_OF_WEEK_LABELS, scheduleSchema, type ScheduleInput } from "@/lib/validations/schedule"
import { Clock } from "lucide-react"
import CreateScheduleModal from "./create-schedule-modal"
import EditScheduleModal from "./edit-schedule-modal"
import DeleteScheduleModal from "./delete-schedule-modal"
import ScheduleCard from "./schedule-card"

type Schedule = {
  id: number
  dayOfWeek: keyof typeof DAYS_OF_WEEK_LABELS
  startTime: string
  endTime: string
}

export default function ScheduleList() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null)
  const [deletingScheduleId, setDeletingScheduleId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const form = useForm<ScheduleInput>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      dayOfWeek: "Monday",
      startTime: "",
      endTime: ""
    }
  })

  const { reset, setValue } = form

  useEffect(() => {
    fetchSchedules()
  }, [])

  const fetchSchedules = async () => {
    try {
      const response = await fetch("/api/schedules")
      if (response.ok) {
        const data = await response.json()
        setSchedules(data)
      } else {
        toast.error("Erro ao carregar disponibilidades")
      }
    } catch (error) {
      console.error("Erro ao carregar disponibilidades:", error)
      toast.error("Erro ao carregar disponibilidades")
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: ScheduleInput) => {
    setSubmitting(true)

    try {
      const method = editingSchedule ? "PUT" : "POST"
      const url = editingSchedule 
        ? `/api/schedules/${editingSchedule.id}` 
        : "/api/schedules"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        await fetchSchedules()
        resetForm()
        setIsCreateModalOpen(false)
        setIsEditModalOpen(false)
        toast.success(editingSchedule ? "Disponibilidade atualizada com sucesso!" : "Disponibilidade criada com sucesso!")
      } else {
        const error = await response.json()
        toast.error(error.error || "Erro ao salvar disponibilidade")
      }
    } catch (error) {
      console.error("Erro ao salvar disponibilidade:", error)
      toast.error("Erro ao salvar disponibilidade")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (schedule: Schedule) => {
    setEditingSchedule(schedule)
    setValue("dayOfWeek", schedule.dayOfWeek)
    setValue("startTime", schedule.startTime)
    setValue("endTime", schedule.endTime)
    setIsEditModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    setDeletingScheduleId(id)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!deletingScheduleId) return

    try {
      const response = await fetch(`/api/schedules/${deletingScheduleId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        await fetchSchedules()
        toast.success("Disponibilidade excluída com sucesso!")
      } else {
        const error = await response.json()
        toast.error(error.error || "Erro ao excluir disponibilidade")
      }
    } catch (error) {
      console.error("Erro ao excluir disponibilidade:", error)
      toast.error("Erro ao excluir disponibilidade")
    } finally {
      setIsDeleteModalOpen(false)
      setDeletingScheduleId(null)
    }
  }

  const cancelDelete = () => {
    setIsDeleteModalOpen(false)
    setDeletingScheduleId(null)
  }

  const resetForm = () => {
    reset({
      dayOfWeek: "Monday",
      startTime: "",
      endTime: ""
    })
    setEditingSchedule(null)
  }

  const groupedSchedules = schedules.reduce((acc, schedule) => {
    if (!acc[schedule.dayOfWeek]) {
      acc[schedule.dayOfWeek] = []
    }
    acc[schedule.dayOfWeek].push(schedule)
    return acc
  }, {} as Record<keyof typeof DAYS_OF_WEEK_LABELS, Schedule[]>)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-muted-foreground">Carregando disponibilidades...</div>
      </div>
    )
  }

  return (
      <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Disponibilidade</h2>
          <p className="text-sm sm:text-base text-muted-foreground">Gerencie seus horários de atendimento</p>
        </div>
        
        <CreateScheduleModal
          isOpen={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          form={form}
          onSubmit={onSubmit}
          submitting={submitting}
          onCancel={() => {
            resetForm()
            setIsCreateModalOpen(false)
          }}
        />
      </div>

      <EditScheduleModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        form={form}
        onSubmit={onSubmit}
        submitting={submitting}
        onCancel={() => {
          resetForm()
          setIsEditModalOpen(false)
        }}
      />

      <DeleteScheduleModal
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      {schedules.length === 0 ? (
        <div className="text-center py-8 sm:py-12 px-4">
          <Clock className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm sm:text-base font-semibold text-foreground">
            Nenhuma disponibilidade cadastrada
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
            Comece adicionando seus horários de atendimento
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {Object.entries(DAYS_OF_WEEK_LABELS).map(([dayKey, dayLabel]) => {
            const daySchedules = groupedSchedules[dayKey as keyof typeof DAYS_OF_WEEK_LABELS] || []
            
            return (
              <ScheduleCard
                key={dayKey}
                dayLabel={dayLabel}
                schedules={daySchedules}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
