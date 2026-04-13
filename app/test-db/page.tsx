'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestDBPage() {
  const [data, setData] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      // Intentamos obtener datos de una tabla común (ajusta si conoces tus tablas)
      const { data, error } = await supabase.from('users').select('*').limit(5)
      if (error) setError(error.message)
      else setData(data || [])
    }
    fetchData()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 font-sans text-gray-800">Database Connection Test</h1>
      <p className="mb-4 text-sm text-gray-500">Connecting to Supabase at: {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error connecting to Supabase:</p>
          <p>{error}</p>
          <p className="mt-2 text-xs italic">Make sure you have put your real ANON KEY in the .env file</p>
        </div>
      )}

      {!error && data.length === 0 && (
        <p className="text-gray-500">Loading data or empty table...</p>
      )}

      {data.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Data from 'users' table:</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-xs">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-8 pt-8 border-t border-gray-200">
        <a
          href="/"
          className="text-blue-600 hover:underline text-sm"
        >
          ← Back to home
        </a>
      </div>
    </div>
  )
}
