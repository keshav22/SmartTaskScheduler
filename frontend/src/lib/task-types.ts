export type Task = {
  task_id: number
  title: string
  description: string
  start_time: string
  duration: number
  priority: number
  deadline: string
  status: string
  dependencies: string[] | null
}
