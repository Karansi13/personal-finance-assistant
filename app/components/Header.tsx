'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { LoginButton } from './LoginButton'
import { LogoutButton } from './LogoutButton'

export default function Header() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const handleNavigation = (path: string) => {
    if (status === 'authenticated') {
      router.push(path)
    } else {
      router.push('/login')
    }
  }

  return (
    <header className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">Expensera</Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <button onClick={() => handleNavigation('/expenses')} className="hover:text-blue-200">
                Expenses
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigation('/budget')} className="hover:text-blue-200">
                Budget
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigation('/analysis')} className="hover:text-blue-200">
                Analysis
              </button>
            </li>
          </ul>
        </nav>
        {session ? <LogoutButton /> : <LoginButton />}
      </div>
    </header>
  )
}

