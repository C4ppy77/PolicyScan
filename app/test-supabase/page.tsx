'use client'

import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'

export default function TestSupabase() {
  const [data, setData] = useState<any[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('test').select('*')
      if (error) {
        setError(error.message)
      } else {
        setData(data)
      }
    }
    fetchData()
  }, [])

  return (
    <div>
      <h1>Supabase Connection Test</h1>
      {error && <p>Error: {error}</p>}
      {data && (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      )}
    </div>
  )
}
