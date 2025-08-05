'use client'

import { supabase } from '@/lib/supabaseClient'
import { useEffect, useState } from 'react'
import { savePolicyScan } from '@/lib/savePolicyScan'

export default function TestSupabase() {
  const [data, setData] = useState<any[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [scanResult, setScanResult] = useState<any | null>(null)
  const [scanError, setScanError] = useState<string | null>(null)

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

  const handleTestSavePolicyScan = async () => {
    setScanResult(null)
    setScanError(null)

    const testScanData = {
      manufacturer: 'Test Manufacturer',
      model: 'Test Model',
      ncd_years: 5,
      premium_last_year: 500.5,
      renewal_date: '2025-12-01',
      insurer_name: 'Test Insurer Inc.',
      age_range: '31-35',
      age_multiplier: 1.1,
      region: 'Scotland',
      region_multiplier: 0.9,
    }

    try {
      const result = await savePolicyScan(testScanData)
      setScanResult(result)
    } catch (e: any) {
      setScanError(e.message)
    }
  }

  return (
    <div>
      <h1>Supabase Connection Test</h1>
      {error && <p>Error: {error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
      <hr />
      <h2>Test `savePolicyScan`</h2>
      <button onClick={handleTestSavePolicyScan}>Run Test</button>
      {scanError && <p style={{ color: 'red' }}>Error: {scanError}</p>}
      {scanResult && (
        <div>
          <p>Success!</p>
          <pre>{JSON.stringify(scanResult, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
