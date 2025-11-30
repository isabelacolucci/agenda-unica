import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { ZodError } from "zod"
import { prisma } from "@/lib/prisma"
import { signInSchema } from "@/lib/validations/auth"
import { verifyPassword } from "@/lib/auth/password"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const { handlers, signIn, signOut, auth } = (NextAuth as any)({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email", placeholder: "seu@email.com" },
        password: { label: "Senha", type: "password", placeholder: "••••••••" },
      },
      authorize: async (credentials) => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { email, password } = await signInSchema.parseAsync(credentials as any)
          
          // Buscar prestador pelo email
          const provider = await prisma.provider.findUnique({
            where: { email }
          })
          
          if (!provider) {
            throw new Error("Credenciais inválidas.")
          }
          
          // Verificar senha
          const isValidPassword = await verifyPassword(password, provider.password)
          
          if (!isValidPassword) {
            throw new Error("Credenciais inválidas.")
          }
          
          // Retornar dados do usuário para a sessão
          return {
            id: provider.id.toString(),
            email: provider.email,
            name: provider.name,
            businessName: provider.businessName,
            publicUrl: provider.publicUrl,
          }
        } catch (error) {
          if (error instanceof ZodError) {
            // Retorna null para indicar que as credenciais são inválidas
            return null
          }
          
          // Re-throw outros erros
          throw error
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 60, // 30 minutes
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id
        token.businessName = user.businessName
        token.publicUrl = user.publicUrl
      }
      
      // Always fetch fresh data from database to ensure session is up-to-date
      if (token.id) {
        try {
          const provider = await prisma.provider.findUnique({
            where: { id: parseInt(token.id) },
            select: {
              name: true,
              businessName: true,
              publicUrl: true,
              email: true,
            },
          })
          
          if (provider) {
            token.name = provider.name
            token.email = provider.email
            token.businessName = provider.businessName
            token.publicUrl = provider.publicUrl
          }
        } catch (error) {
          console.error("Error fetching user data for token:", error)
        }
      }
      
      return token
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.businessName = token.businessName as string
        session.user.publicUrl = token.publicUrl as string
      }
      return session
    },
  },
})
