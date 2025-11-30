"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from 'react-toastify'
import { registerProviderSchema, type RegisterProviderInput } from '@/lib/validations/provider'
import { formatPhoneNumber, cleanPhoneNumber } from '@/lib/utils'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<RegisterProviderInput>({
    resolver: zodResolver(registerProviderSchema),
    defaultValues: {
      name: "",
      businessName: "",
      email: "",
      password: "",
      phone: "",
      address: "",
    },
  })

  async function onSubmit(data: RegisterProviderInput) {
    setIsLoading(true)

    try {
      // Remover a máscara do telefone antes de enviar
      const dataToSend = {
        ...data,
        phone: cleanPhoneNumber(data.phone) // Remove todos os caracteres não numéricos
      }

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success(result.message || 'Prestador cadastrado com sucesso!')
        
        // Redirecionar para login após 2 segundos
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        toast.error(result.error || 'Erro ao cadastrar prestador')
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error)
      toast.error('Erro de conexão. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 sm:space-y-8 p-6 sm:p-8 bg-card rounded-lg shadow-md border border-border">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Cadastre-se
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Crie sua conta de prestador de serviços
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Nome completo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite seu nome completo"
                      className="h-11 sm:h-10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Nome do negócio</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Barbearia do João"
                      className="h-11 sm:h-10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">E-mail</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="seu@email.com"
                      className="h-11 sm:h-10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Senha</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="h-11 sm:h-10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Telefone</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="(11) 99999-9999"
                      className="h-11 sm:h-10"
                      value={field.value}
                      onChange={(e) => {
                        const formatted = formatPhoneNumber(e.target.value)
                        field.onChange(formatted)
                      }}
                      onBlur={field.onBlur}
                      maxLength={15} // Máximo para (XX) XXXXX-XXXX
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Endereço</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Rua, número, bairro, cidade"
                      className="h-11 sm:h-10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit"
              size="lg"
              className="w-full h-11 sm:h-10 text-base sm:text-sm"
              disabled={isLoading}
            >
              {isLoading ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </form>
        </Form>

        <div className="text-center pt-2">
          <p className="text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <a
              href="/login"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Faça login
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
