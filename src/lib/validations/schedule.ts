import { z } from "zod"

const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday", 
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
] as const

const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/

export const scheduleSchema = z.object({
  dayOfWeek: z.enum(DAYS_OF_WEEK, {
    message: "Dia da semana inválido"
  }),
  startTime: z
    .string()
    .regex(timeRegex, "Horário inicial deve estar no formato HH:MM"),
  endTime: z
    .string()
    .regex(timeRegex, "Horário final deve estar no formato HH:MM")
}).refine((data) => {
  const [startHour, startMin] = data.startTime.split(':').map(Number)
  const [endHour, endMin] = data.endTime.split(':').map(Number)
  
  const startMinutes = startHour * 60 + startMin
  const endMinutes = endHour * 60 + endMin
  
  return endMinutes > startMinutes
}, {
  message: "Horário final deve ser posterior ao horário inicial",
  path: ["endTime"]
})

export const updateScheduleSchema = scheduleSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  {
    message: "Pelo menos um campo deve ser fornecido para atualização",
  }
)

export type ScheduleInput = z.infer<typeof scheduleSchema>
export type UpdateScheduleInput = z.infer<typeof updateScheduleSchema>

export const DAYS_OF_WEEK_LABELS = {
  Monday: "Segunda-feira",
  Tuesday: "Terça-feira", 
  Wednesday: "Quarta-feira",
  Thursday: "Quinta-feira",
  Friday: "Sexta-feira",
  Saturday: "Sábado",
  Sunday: "Domingo"
} as const
