'use client'

import { useEffect, useReducer, useRef, useState } from 'react'
import { ButtonComponent } from '../common/button'
import { CircularProgress } from './circular_progress'
import { apiClient } from '@/services/api'
import { useSearchParams } from 'next/navigation'
import { Task } from '@/lib/task-types'
import { SpinnerComponent } from '../common/spinner'

interface FocusComponentProps {
  time: number
  pauseTime: number
  totalSessions: number
}
type TimerState = {
  seconds: number
  breakStarted: boolean
  sessionsCompleted: number
  timerRunning: boolean
}

interface UserSetting {
  session_duration: number
  break_duration: number
}
interface FocusResponse {
  current_task: Task | null
  next_task: Task | null
  user_setting: UserSetting
  total_tasks: number
}
export function FocusComponent() {
  const timerKey = useRef<ReturnType<typeof setInterval> | null>(null)
  const searchParams = useSearchParams()
  const task_id = searchParams.get('task_id')

  const [loading, setLoading] = useState(true)
  const [currentTask, setCurrentTask] = useState<Partial<Task> | null>(null)
  const [nextTask, setNextTask] = useState<Partial<Task> | null>(null)
  const [time, setTime] = useState(25)
  const [pauseTime, setPauseTime] = useState(5)
  const [totalSessions, setTotalSession] = useState(3)
  const [totalTasksLeft, setTotalTasksLeft] = useState(0)

  const timerReducer = (
    state: TimerState,
    action: { type: 'TICK' | 'START' | 'PAUSE' | 'RELOAD' | 'RESET' },
  ) => {
    if (action.type === 'RESET') {
      return {
        ...state,
        breakStarted: false,
        sessionsCompleted: 1,
        seconds: time * 60,
        timerRunning: false,
      }
    } else if (action.type === 'RELOAD') {
      return {
        ...state,
        seconds: state.breakStarted ? pauseTime * 60 : time * 60,
      }
    } else if (action.type == 'START') {
      return {
        ...state,
        timerRunning: true,
      }
    } else if (action.type === 'PAUSE') {
      return {
        ...state,
        timerRunning: false,
      }
    } else if (action.type === 'TICK') {
      if (state.seconds >= 1) {
        return {
          ...state,
          seconds: state.seconds - 1,
        }
      }

      if (state.breakStarted) {
        return {
          ...state,
          breakStarted: false,
          seconds: time * 60,
        }
      }

      return {
        ...state,
        breakStarted: true,
        sessionsCompleted: state.sessionsCompleted + 1,
        seconds: pauseTime * 60,
      }
    }

    return state
  }

  const [state, dispatch] = useReducer(timerReducer, {
    seconds: time * 60,
    breakStarted: false,
    sessionsCompleted: 1,
    timerRunning: false,
  })

  useEffect(() => {
    if (state.seconds < 1 && state.sessionsCompleted == totalSessions) {
      if (timerKey.current) clearInterval(timerKey.current)
      timerKey.current = null
      dispatch({ type: 'RESET' })
    }
  }, [state.seconds, state.sessionsCompleted])

  const fetch_details = (set = true) => {
    let url = '/focus/'

    if (task_id) {
      url += `${task_id}`
    }

    apiClient
      .get(url)
      .then((res) => {
        const response = res as FocusResponse

        if (set) {
          if (response.current_task) {
            setCurrentTask(response.current_task)
            setTotalSession(
              Math.ceil(
                response.current_task.duration /
                  response.user_setting.session_duration,
              ),
            )
          }

          setTime(response.user_setting.session_duration)
          setPauseTime(response.user_setting.break_duration)
          setTotalTasksLeft(response.total_tasks - 1)
        }
        if (response.next_task) setNextTask(response.next_task)
      })
      .catch((err) => {
        console.error('Error fetching tasks:', err)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (task_id) {
      onStartPause()
    }
    fetch_details()
    return () => {
      if (timerKey.current) clearInterval(timerKey.current)
    }
  }, [])

  const getFormattedTime = () => {
    const minutes = Math.floor(state.seconds / 60)
    const seconds = Math.round(state.seconds % 60)

    let strMinutes = minutes.toString()
    let strSeconds = seconds.toString()
    if (minutes < 10) {
      strMinutes = '0' + strMinutes
    }
    if (seconds < 10) {
      strSeconds = '0' + strSeconds
    }

    return `${strMinutes}:${strSeconds}`
  }

  const executeTimer = () => {
    timerKey.current = setInterval(() => {
      dispatch({ type: 'TICK' })
    }, 1000)
  }

  const onStartPause = () => {
    if (state.timerRunning) {
      if (timerKey.current) clearInterval(timerKey.current)
      dispatch({ type: 'PAUSE' })
    } else {
      dispatch({ type: 'START' })
      dispatch({ type: 'TICK' })
      executeTimer()
    }
  }

  const onReload = () => {
    dispatch({ type: 'RELOAD' })
  }

  const handleNextTask = () => {
    apiClient
      .patch(`/tasks/done/${currentTask?.task_id}`, {})
      .then((res) => {
        dispatch({ type: 'RESET' })
        if (timerKey.current) clearInterval(timerKey.current)

        if (nextTask) {
          setTotalSession(Math.ceil(nextTask.duration! / time))
          setCurrentTask(nextTask)
          fetch_details(false)
        }

        setTotalTasksLeft(totalTasksLeft - 1)
        if (totalTasksLeft - 1 < 0) {
          setCurrentTask(null)
          setNextTask(null)
        }
      })
      .catch((err) => {
        console.error('Error fetching tasks:', err)
      })
  }

  return (
    <>
      {loading ? (
        <div className="h-screen flex justify-center items-center">
          <SpinnerComponent />
        </div>
      ) : currentTask ? (
        <div className="flex flex-col justify-center items-center h-screen gap-[16]">
          <div className="flex gap-[5] px-[10] py-[5] items-center bg-[#25F4F41A] bg-opacity-50 rounded-[20] text-[#25F4F4]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              width="15"
              height="16"
              fill="none"
            >
              <circle
                cx="10"
                cy="10"
                r="9"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle
                cx="10"
                cy="10"
                r="6"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle
                cx="10"
                cy="10"
                r="3"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            <p className="text-xs">Active task</p>
          </div>
          <div
            className="text-xl text-[#171C1CFF] font-semibold"
            aria-label="Task name"
          >
            {currentTask.title}
          </div>
          <div className="flex flex-col gap-[20] bg-white p-8 items-center rounded-xl shadow-[0px_8px_16px_#0000000F,0px_0px_0px_#171a1f00]">
            <CircularProgress
              value={
                state.breakStarted
                  ? ((60 * pauseTime - state.seconds) * 100) / (pauseTime * 60)
                  : ((60 * time - state.seconds) * 100) / (time * 60)
              }
              progressColorClass={
                state.breakStarted ? 'stroke-yellow-300' : undefined
              }
            >
              <div className="flex flex-col gap-1 text-center">
                <strong className="text-6xl">{getFormattedTime()}</strong>

                <p className="text-sm text-[#546464]">
                  {state.breakStarted ? 'BREAK TIME' : 'FOCUS TIME'}
                </p>
              </div>
            </CircularProgress>
            <strong className="text-[#25F4F4] text-xs">
              {state.sessionsCompleted} of {totalSessions} sessions
            </strong>
            <div className="flex gap-[16]">
              <div>
                <ButtonComponent
                  type={state.timerRunning ? '' : 'primary'}
                  className="w-46"
                  onClick={onStartPause}
                >
                  <div className="flex gap-4 justify-center">
                    {state.timerRunning ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="4" y="3" width="6" height="18" rx="1.8" />
                        <rect x="14" y="3" width="6" height="18" rx="1.8" />
                      </svg>
                    ) : (
                      <svg
                        width="20px"
                        height="20px"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16.6582 9.28638C18.098 10.1862 18.8178 10.6361 19.0647 11.2122C19.2803 11.7152 19.2803 12.2847 19.0647 12.7878C18.8178 13.3638 18.098 13.8137 16.6582 14.7136L9.896 18.94C8.29805 19.9387 7.49907 20.4381 6.83973 20.385C6.26501 20.3388 5.73818 20.0469 5.3944 19.584C5 19.053 5 18.1108 5 16.2264V7.77357C5 5.88919 5 4.94701 5.3944 4.41598C5.73818 3.9531 6.26501 3.66111 6.83973 3.6149C7.49907 3.5619 8.29805 4.06126 9.896 5.05998L16.6582 9.28638Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                    <p>{state.timerRunning ? 'Pause' : 'Start'}</p>
                  </div>
                </ButtonComponent>
              </div>
              <div className="flex gap-[8]">
                <ButtonComponent
                  className="w-14"
                  onClick={onReload}
                  aria-label="Time reset"
                >
                  <div className="flex justify-center">
                    <svg
                      width="18px"
                      height="18px"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M13.7071 1.29289C14.0976 1.68342 14.0976 2.31658 13.7071 2.70711L12.4053 4.00896C17.1877 4.22089 21 8.16524 21 13C21 17.9706 16.9706 22 12 22C7.02944 22 3 17.9706 3 13C3 12.4477 3.44772 12 4 12C4.55228 12 5 12.4477 5 13C5 16.866 8.13401 20 12 20C15.866 20 19 16.866 19 13C19 9.2774 16.0942 6.23349 12.427 6.01281L13.7071 7.29289C14.0976 7.68342 14.0976 8.31658 13.7071 8.70711C13.3166 9.09763 12.6834 9.09763 12.2929 8.70711L9.29289 5.70711C9.10536 5.51957 9 5.26522 9 5C9 4.73478 9.10536 4.48043 9.29289 4.29289L12.2929 1.29289C12.6834 0.902369 13.3166 0.902369 13.7071 1.29289Z"
                        fill="#currentColor"
                      />
                    </svg>
                  </div>
                </ButtonComponent>
                <ButtonComponent
                  className="w-30"
                  onClick={handleNextTask}
                  aria-label="Next task"
                >
                  <div className="flex justify-center">
                    <svg
                      width="22px"
                      height="22px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M19 6V18M5 18V6L15 12L8.33333 16"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </ButtonComponent>
              </div>
            </div>
          </div>
          <div className="text-xs mt-5 flex gap-[6px] text-[#546464] items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 363.025 363.024"
              width="11"
              height="11"
              fill="none"
            >
              <circle
                cx="181.512"
                cy="181.512"
                r="175.657"
                stroke="currentColor"
                strokeWidth="15.71"
              />
              <path
                d="M83.068 194.046 147.957 258.935 279.451 127.445"
                stroke="currentColor"
                strokeWidth="15.71"
                fill="none"
              />
            </svg>
            <p>{totalTasksLeft} Tasks Remaining Today</p>
          </div>
        </div>
      ) : (
        <div className="h-screen flex justify-center items-center">
          <p className="text-gray-400">
            Please add some tasks from the tab menu and then come back to this
            page to start your focus time
          </p>
        </div>
      )}
    </>
  )
}
