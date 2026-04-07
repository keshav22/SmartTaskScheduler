'use client'

import { AddTaskFormComponent } from '@/components/Tasks/tasks'
import { TaskListComponent } from '@/components/Tasks/tasks'
import { useState, useEffect } from 'react'
import { apiClient } from '@/services/api'


interface Task {
  id: number
  title: string
  description: string
  deadline: string
  priority: string
}

export default function TaskPage() {

  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchTasks = async() => {
    try {
      const response = await apiClient.get('/tasks')
      setTasks(response as Task[])
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <div className="p-4 flex v-screen">
      <div className="w-[65%] pr-4">
        <h1 className="text-2xl font-bold mb-4 text-black">My Tasks</h1>
        <TaskListComponent tasks={tasks} />
      </div>
      <div className='w-[35%] pl-4 border-l'>
        <h1 className="text-2xl font-bold mb-4 text-black">Tasks</h1>
        <AddTaskFormComponent onTaskAdded={() => {}} />
      </div>
    </div>
  )
}
