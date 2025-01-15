import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to Your Personal Finance Assistant
        </h1>
        <p className="mt-3 text-2xl">
          Manage your finances with AI-powered insights
        </p>
        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <Link href="/expenses" className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600">
            <h3 className="text-2xl font-bold">Expenses &rarr;</h3>
            <p className="mt-4 text-xl">
              Track and categorize your expenses
            </p>
          </Link>
          <Link href="/budget" className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600">
            <h3 className="text-2xl font-bold">Budget &rarr;</h3>
            <p className="mt-4 text-xl">
              Get personalized budget suggestions
            </p>
          </Link>
          <Link href="/investments" className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600">
            <h3 className="text-2xl font-bold">Investments &rarr;</h3>
            <p className="mt-4 text-xl">
              Receive investment recommendations
            </p>
          </Link>
          <Link href="/" className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600">
            <h3 className="text-2xl font-bold">Coming Soon &rarr;</h3>
            <p className="mt-4 text-xl">
              More things to come!
            </p>
          </Link>
        </div>
      </main>
    </div>
  )
}

