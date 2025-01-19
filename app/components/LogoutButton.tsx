'use client'

import { signOut } from "next-auth/react"
import { Button } from "../components/ui/button"

export function LogoutButton() {
  return <Button className="bg-white text-blue-600 hover:bg-blue-50" onClick={() => signOut()}>Log out</Button>
}

