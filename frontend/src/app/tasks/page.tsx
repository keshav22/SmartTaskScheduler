import { TasksPageComponent } from '@/components/Tasks/tasks'
import { SpinnerComponent } from '@/components/common/spinner'
import { Suspense } from 'react'
export default function TaskPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex justify-center items-center">
          <SpinnerComponent />
        </div>
      }
    >
      <TasksPageComponent />
    </Suspense>
  )
}
