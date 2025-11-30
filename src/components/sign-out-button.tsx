"use client"

import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"

export function SignOutButton() {
  const router = useRouter()
  
  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push("/login")
  }

  return (
    <button
      onClick={handleSignOut}
      className="bg-destructive hover:bg-destructive/90 text-white px-4 py-2 rounded-md text-sm font-medium"
    >
      Sair
    </button>
  )
}