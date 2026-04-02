import { apiClient } from '@/services/api'
import { use } from 'react'

interface Task {
  title: string
  description: string
}

// interface TaskPageComponentProps {

// }
export function TasksPageComponent() {
  const tasks: Task[] = use(apiClient.get('/tasks'))

  return (
    <div>
      {tasks.map((task: Task, index: number) => {
        return <div key={index}>{task.title}</div>
      })}
    </div>
  )
}
