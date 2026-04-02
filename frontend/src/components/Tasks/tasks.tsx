'use client'

import { apiClient } from '@/services/api'
import { useEffect, useState } from 'react'
import { SpinnerComponent } from '../common/spinner'

interface Task {
  title: string
  description: string
}

// interface TaskPageComponentProps {

// }
export function TasksPageComponent() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient
      .get('/tasks')
      .then((res) => {
        setTasks(res as Task[])
      })
      .catch((err) => {
        console.error('Error fetching tasks:', err)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {loading ? (
        <div className="h-screen flex justify-center items-center">
          <SpinnerComponent />
        </div>
      ) : (
        tasks.map((task: Task, index: number) => {
          return <div key={index}>{task.title}</div>
        })
      )}
    </div>
  )
}
