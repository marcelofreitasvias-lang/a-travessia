import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

type WeeklyPlan = {
  id: string
  user_id: string
  week_key: string
  vision: string
}

type DailyRecord = {
  id: string
  user_id: string
  date_key: string
  morning: string
}

export default function App() {
  const [plans, setPlans] = useState<WeeklyPlan[]>([])
  const [vision, setVision] = useState('')

  const [records, setRecords] = useState<DailyRecord[]>([])
  const [morning, setMorning] = useState('')

  const loadPlans = async () => {
    const { data, error } = await supabase
      .from('weekly_plans')
      .select('*')

    if (error) {
      console.log('ERRO AO LER PLANO:', error)
      return
    }

    setPlans(data || [])
  }

  const savePlan = async () => {
    if (!vision) return

    const { error } = await supabase
      .from('weekly_plans')
      .insert([
        {
          user_id: crypto.randomUUID(),
          week_key: '2026-05-03',
          vision,
        },
      ])

    if (error) {
      console.log('ERRO AO SALVAR PLANO:', error)
      return
    }

    setVision('')
    loadPlans()
  }

  const loadRecords = async () => {
    const { data, error } = await supabase
      .from('daily_records')
      .select('*')

    if (error) {
      console.log('ERRO AO LER DAILY:', error)
      return
    }

    setRecords(data || [])
  }

  const saveRecord = async () => {
    if (!morning) return

    const { error } = await supabase
      .from('daily_records')
      .insert([
        {
          user_id: crypto.randomUUID(),
          date_key: '2026-05-06',
          morning,
        },
      ])

    if (error) {
      console.log('ERRO AO SALVAR DAILY:', error)
      return
    }

    setMorning('')
    loadRecords()
  }

  useEffect(() => {
    loadPlans()
    loadRecords()
  }, [])

  return (
    <div>
      <h1>A Travessia</h1>

      <h2>Plano Semanal</h2>

      <input
        placeholder="Visão da semana"
        value={vision}
        onChange={(e) => setVision(e.target.value)}
      />

      <button onClick={savePlan}>
        Salvar plano
      </button>

      {plans.map((plan) => (
        <p key={plan.id}>
          {plan.week_key} — {plan.vision}
        </p>
      ))}

      <hr />

      <h2>Diário — Morning</h2>

      <input
        placeholder="Como começa o dia?"
        value={morning}
        onChange={(e) => setMorning(e.target.value)}
      />

      <button onClick={saveRecord}>
        Salvar dia
      </button>

      {records.map((rec) => (
        <p key={rec.id}>
          {rec.date_key} — {rec.morning}
        </p>
      ))}
    </div>
  )
}