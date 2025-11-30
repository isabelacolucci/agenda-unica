declare module "next-auth" {
  interface User {
    businessName?: string
    publicUrl?: string
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      businessName?: string
      publicUrl?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    businessName?: string
    publicUrl?: string
  }
}
