'use client'

import Link from 'next/link'
import { Button } from "../components/ui/button"

export function LoginButton() {
  return (
    <Link href="/login">
      <Button className='bg-white text-blue-600 hover:bg-blue-50'>Log in</Button>
    </Link>
  )
}

