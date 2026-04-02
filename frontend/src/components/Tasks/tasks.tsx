import { apiClient } from '@/services/api'
import { use } from 'react'

interface TaskPageComponentProps {}
export function TasksPageComponent({}: TaskPageComponentProps) {
  const tasks: any[] = use(apiClient.get('/tasks'))

  return (
    <div>
      {tasks.map((task: any) => {
        return <div>{task.title}</div>
      })}
    </div>
  )
}
