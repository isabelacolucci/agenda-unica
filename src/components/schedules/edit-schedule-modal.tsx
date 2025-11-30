"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DAYS_OF_WEEK_LABELS, type ScheduleInput } from "@/lib/validations/schedule"
import { UseFormReturn } from "react-hook-form"

interface EditScheduleModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  form: UseFormReturn<ScheduleInput>
  onSubmit: (data: ScheduleInput) => Promise<void>
  submitting: boolean
  onCancel: () => void
}

export default function EditScheduleModal({
  isOpen,
  onOpenChange,
  form,
  onSubmit,
  submitting,
  onCancel
}: EditScheduleModalProps) {
  const { register, handleSubmit, formState: { errors } } = form

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Disponibilidade</DialogTitle>
          <DialogDescription>
            Atualize o horário de atendimento
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="dayOfWeek">Dia da Semana</Label>
            <select
              id="dayOfWeek"
              {...register("dayOfWeek")}
              className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-ring focus:outline-none focus:ring-ring"
              required
            >
              {Object.entries(DAYS_OF_WEEK_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {errors.dayOfWeek && (
              <p className="mt-1 text-sm text-red-600">{errors.dayOfWeek.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="startTime">Horário Inicial</Label>
            <Input
              id="startTime"
              type="time"
              {...register("startTime")}
              required
            />
            {errors.startTime && (
              <p className="mt-1 text-sm text-red-600">{errors.startTime.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="endTime">Horário Final</Label>
            <Input
              id="endTime"
              type="time"
              {...register("endTime")}
              required
            />
            {errors.endTime && (
              <p className="mt-1 text-sm text-red-600">{errors.endTime.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Salvando..." : "Atualizar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
