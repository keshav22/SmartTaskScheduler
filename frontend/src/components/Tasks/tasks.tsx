'use client'

import { apiClient } from '@/services/api'
import { useEffect, useState } from 'react'
import { SpinnerComponent } from '../common/spinner'

interface Task {
  title: string
  description: string
}

interface AddTaskFormProps {
  onTaskAdded: () => void
}

export function AddTaskFormComponent({ onTaskAdded }: AddTaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [priority, setPriority] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    apiClient
      .post('/tasks', { title, description, deadline, priority })
      .then(() => {
        setTitle('')
        setDescription('')
        setDeadline('')
        setPriority('')
        onTaskAdded()
      })
      .catch((err) => {
        console.error('Error adding task:', err)
      })
      .finally(() => setLoading(false))
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4 text-black">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="border p-2 mb-2 w-full"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        className="border p-2 mb-2 w-full"
      />
      <textarea
        placeholder="Deadline"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        required
        className="border p-2 mb-2 w-full"
      />
      <textarea
        placeholder="Priority"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        required
        className="border p-2 mb-2 w-full"
      />
      <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2">
        {loading ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  )
}

export function TaskCardComponent({ task }: { task: Task }) {
  return (
    <div className="border p-4 mb-2">
      <h2 className="text-xl font-bold">{task.title}</h2>
      <p>{task.description}</p>
    </div>
  )
}

export function TaskListComponent({tasks}: {tasks: Task[]}) {
  return (
    <div>
      {tasks.map((task, index) => (
        <TaskCardComponent key={index} task={task} />
      ))}
    </div>
  )
}


// export function TasksPageComponent() {
//   const [tasks, setTasks] = useState<Task[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     apiClient
//       .get('/tasks')
//       .then((res) => {
//         setTasks(res as Task[])
//       })
//       .catch((err) => {
//         console.error('Error fetching tasks:', err)
//       })
//       .finally(() => setLoading(false))
//   }, [])

//   return (
//     <div>
//       {loading ? (
//         <div className="h-screen flex justify-center items-center">
//           <SpinnerComponent />
//         </div>
//       ) : (
//         tasks.map((task: Task, index: number) => {
//           return <div key={index}>{task.title}</div>
//         })
//       )}
//     </div>
//   )
// }
