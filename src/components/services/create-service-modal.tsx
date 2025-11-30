import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-toastify"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Schema específico para o formulário de criação
const createServiceSchema = z.object({
  name: z
    .string()
    .min(1, "Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  description: z
    .string()
    .max(500, "Descrição deve ter no máximo 500 caracteres")
    .optional()
    .or(z.literal("")),
  durationMinutes: z
    .number()
    .min(1, "Duração deve ser pelo menos 1 minuto")
    .max(600, "Duração deve ser no máximo 10 horas"),
  price: z
    .number()
    .min(0.01, "Preço deve ser maior que zero"),
  isActive: z.boolean()
})

type CreateServiceFormData = z.infer<typeof createServiceSchema>

interface Service {
  id: number
  name: string
  description: string | null
  durationMinutes: number
  price: number
  isActive: boolean
}

interface CreateServiceModalProps {
  isOpen: boolean
  onClose: () => void
  onServiceCreated: (newService: Service) => void
}

export function CreateServiceModal({
  isOpen,
  onClose,
  onServiceCreated
}: CreateServiceModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CreateServiceFormData>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      name: "",
      description: "",
      durationMinutes: 60,
      price: 0,
      isActive: true
    }
  })

  const onSubmit = async (data: CreateServiceFormData) => {
    try {
      setIsLoading(true)

      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao cadastrar serviço')
      }

      const newService = await response.json()
      
      // Atualizar a lista de serviços
      onServiceCreated(newService)
      
      toast.success("Serviço cadastrado com sucesso!")
      handleClose()
    } catch (error) {
      console.error('Erro ao cadastrar serviço:', error)
      toast.error(error instanceof Error ? error.message : "Erro ao cadastrar serviço")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Serviço</DialogTitle>
          <DialogDescription>
            Preencha as informações do novo serviço que você oferece.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Serviço</Label>
            <Input
              id="name"
              placeholder="Ex: Corte de cabelo"
              {...register("name")}
              className="mt-1"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Descreva o serviço..."
              {...register("description")}
              className="mt-1"
              rows={3}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="durationMinutes">Duração (minutos)</Label>
            <Input
              id="durationMinutes"
              type="number"
              placeholder="60"
              {...register("durationMinutes", { valueAsNumber: true })}
              className="mt-1"
            />
            {errors.durationMinutes && (
              <p className="mt-1 text-sm text-red-600">{errors.durationMinutes.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="price">Preço (R$)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="50.00"
              {...register("price", { valueAsNumber: true })}
              className="mt-1"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="isActive"
              type="checkbox"
              {...register("isActive")}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <Label htmlFor="isActive">Serviço ativo</Label>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Cadastrando..." : "Cadastrar Serviço"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
