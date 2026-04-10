'use client'

import { Button } from '@/components/ui/button'
import { useEffect, useReducer, useState } from 'react'
import { apiClient } from '@/services/api'

import { type Task } from '@/lib/task-types'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

import moment from 'moment'

type Action = {
  type: 'SET_FIELD' | 'RESET'
  field?:
    | 'title'
    | 'description'
    | 'priority'
    | 'start_time'
    | 'duration'
    | 'deadline'
    | 'dependencies'
  payload?: Task
  value?: string | string[]
}

function reducer(state: Partial<Task>, action: Action): Partial<Task> {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field!]: action.value }
    case 'RESET':
      return action.payload ?? {}
    default:
      return state
  }
}

type AddEditTaskDialogProps = {
  AllTasks: Task[]
  task: Task
  onClose: () => void
  openDialog: boolean
  onSave: (updatedTask: Task) => void
}

export default function AddEditTaskDialog({
  AllTasks,
  task,
  openDialog,
  onClose,
  onSave,
}: AddEditTaskDialogProps) {
  const [taskFormState, dispatchTaskUpdate] = useReducer(reducer, { ...task })
  const [saveDisabled, setSaveDisabled] = useState(false)
  useEffect(() => {
    dispatchTaskUpdate({ type: 'RESET', payload: task })
  }, [task])

  const [taskFormErrors, setTaskFormErrors] = useState<Record<string, string>>(
    {},
  )

  const upsertTask = async () => {
    try {
      const payload = {
        title: taskFormState.title,
        description: taskFormState.description,
        priority: taskFormState.priority ? taskFormState.priority : 'low',
        duration: taskFormState.duration,
        deadline: taskFormState.deadline
          ? moment(taskFormState.deadline).toISOString()
          : null,
        start_time: taskFormState.start_time
          ? moment(taskFormState.start_time).toISOString()
          : null,
        dependencies: taskFormState.dependencies || [],
      }

      let data: Task

      if (task?.task_id) {
        // EDIT
        data = await apiClient.patch(`/tasks/edit/${task.task_id}`, payload)
      } else {
        // CREATE
        data = await apiClient.post(`/tasks/add`, payload)
      }

      onSave(data) // update UI
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setSaveDisabled(false)
    }
  }

  const handleSave = () => {
    const errors: Record<string, string> = {}

    if (!taskFormState.title?.trim()) {
      errors.title = 'Title is required.'
    }

    if (!taskFormState.duration) {
      errors.duration = 'Duration is required.'
    }

    if (
      taskFormState.deadline &&
      moment(taskFormState.deadline).isBefore(moment.now())
    ) {
      errors.deadline = 'A task deadline has to be in future'
    }

    setTaskFormErrors(errors)

    if (Object.keys(errors).length === 0) {
      setSaveDisabled(true)
      upsertTask()
    }
  }

  return (
    <Dialog
      open={openDialog}
      onOpenChange={(isOpen) => {
        onClose()
        if (!isOpen) {
          dispatchTaskUpdate({ type: 'RESET' })
          setTaskFormErrors({})
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task?.task_id ? `Edit` : `Add`} Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-1">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Title"
              value={task.title}
              onChange={(e) =>
                dispatchTaskUpdate({
                  type: 'SET_FIELD',
                  field: 'title',
                  value: e.target.value,
                })
              }
            />
            {taskFormErrors.title && (
              <p className="text-red-500 text-xs">{taskFormErrors.title}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="location">Description</Label>
            <Textarea
              id="description"
              placeholder="Add a detailed description of the task"
              value={taskFormState.description}
              onChange={(e) =>
                dispatchTaskUpdate({
                  type: 'SET_FIELD',
                  field: 'description',
                  value: e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="start">Start Time</Label>
            <Input
              id="start"
              type="datetime-local"
              value={
                taskFormState?.start_time
                  ? moment(taskFormState.start_time).format('YYYY-MM-DDTHH:mm')
                  : ''
              }
              onChange={(e) =>
                dispatchTaskUpdate({
                  type: 'SET_FIELD',
                  field: 'start_time',
                  value: e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="deadline">Deadline</Label>
            <Input
              id="deadline"
              type="datetime-local"
              value={
                taskFormState.deadline
                  ? moment(taskFormState.deadline).format('YYYY-MM-DDTHH:mm')
                  : ''
              }
              onChange={(e) =>
                dispatchTaskUpdate({
                  type: 'SET_FIELD',
                  field: 'deadline',
                  value: e.target.value,
                })
              }
            />
            {taskFormErrors.deadline && (
              <p className="text-red-500 text-xs">{taskFormErrors.deadline}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="duration">Duration (in minutes) *</Label>
            <Input
              id="duration"
              placeholder="60"
              value={task.duration}
              type="number"
              onChange={(e) =>
                dispatchTaskUpdate({
                  type: 'SET_FIELD',
                  field: 'duration',
                  value: e.target.value,
                })
              }
            />
            {taskFormErrors.duration && (
              <p className="text-red-500 text-xs">{taskFormErrors.duration}</p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="priority">Priority</Label>
            <div id="priority" className="flex gap-3">
              <button
                className={
                  taskFormState.priority?.toString() == 'high'
                    ? ''
                    : 'opacity-30'
                }
                onClick={() => {
                  dispatchTaskUpdate({
                    type: 'SET_FIELD',
                    field: 'priority',
                    value: 'high',
                  })
                }}
              >
                <div className="w-fit border-1 text-red-700 border-[#E0525233] px-[10px] py-[3px] text-sm rounded-xl">
                  High
                </div>
              </button>
              <button
                className={
                  taskFormState.priority?.toString() == 'medium'
                    ? ''
                    : 'opacity-30'
                }
                onClick={() => {
                  dispatchTaskUpdate({
                    type: 'SET_FIELD',
                    field: 'priority',
                    value: 'medium',
                  })
                }}
              >
                <div className="w-fit border-1 text-yellow-700 border-[var(--color-yellow-200)] px-[10px] py-[3px] text-sm rounded-xl">
                  Medium
                </div>
              </button>
              <button
                className={
                  taskFormState.priority?.toString() == 'low'
                    ? ''
                    : !('priority' in taskFormState)
                      ? ''
                      : 'opacity-30'
                }
                onClick={() => {
                  dispatchTaskUpdate({
                    type: 'SET_FIELD',
                    field: 'priority',
                    value: 'low',
                  })
                }}
              >
                <div className="w-fit border-1 text-green-700 border-[var(--color-green-200)] px-[10px] py-[3px] text-sm rounded-xl">
                  Low
                </div>
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="patient">Select Dependencies</Label>
            <Select
              multiple
              value={taskFormState.dependencies}
              onValueChange={(value) =>
                dispatchTaskUpdate({
                  type: 'SET_FIELD',
                  field: 'dependencies',
                  value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a dependent task" />
              </SelectTrigger>
              <SelectContent>
                {AllTasks.map((task: Task) => (
                  <SelectItem key={task.task_id} value={task.task_id}>
                    {task.task_id}
                    {task.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={() => {
              onClose()
            }}
            variant="outline"
          >
            Close
          </Button>
          <Button disabled={saveDisabled} onClick={handleSave}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
