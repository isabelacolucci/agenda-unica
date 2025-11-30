"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from 'react-toastify'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signInSchema, type SignInInput } from "@/lib/validations/auth"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  })

  const onSubmit = async (data: SignInInput) => {
    try {
      setIsLoading(true)

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error("Email ou senha incorretos")
        return
      }

      if (result?.ok) {
        toast.success("Login realizado com sucesso!")
        router.push("/dashboard")
        router.refresh()
      }
    } catch {
      toast.error("Ocorreu um erro inesperado. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 sm:space-y-8 p-6 sm:p-8 bg-card rounded-lg shadow-md border border-border">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Login
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Faça login para acessar sua agenda
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
          <div>
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              {...register("email")}
              className="mt-1.5 h-11 sm:h-10"
            />
            {errors.email && (
              <p className="mt-1.5 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label htmlFor="password" className="text-sm font-medium">Senha</Label>
              <a
                href="/forgot-password"
                className="text-xs sm:text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Esqueceu a senha?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className="h-11 sm:h-10"
            />
            {errors.password && (
              <p className="mt-1.5 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full h-11 sm:h-10 text-base sm:text-sm"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>

        <div className="text-center pt-2">
          <p className="text-sm text-muted-foreground">
            Ainda não tem uma conta?{" "}
            <a
              href="/register"
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Cadastre-se aqui
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
