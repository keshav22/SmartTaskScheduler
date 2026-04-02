'use client'

import { cn } from '@/utils/css'
import { ReactNode } from 'react'

interface CircularProgressProps {
  value: number
  children?: ReactNode
  className?: string
  progressColorClass?: string
}

export function CircularProgress({
  value = 0,
  children,
  className,
  progressColorClass = '#25F4F4',
}: CircularProgressProps) {
  const radius = 110
  const strokeWidth = 8
  const circumference = 2 * Math.PI * radius

  const center = 120
  const viewSize = center * 2

  return (
    <div className={cn('relative h-64 w-64', className!)}>
      <svg
        viewBox={`0 0 ${viewSize} ${viewSize}`}
        className="h-full w-full -rotate-90"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          className="fill-none stroke-[#f1f3f3]"
        />

        <circle
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (value / 100) * circumference}
          className={`fill-none stroke-[#25F4F4] transition-all duration-500 ${progressColorClass}`}
          strokeLinecap="round"
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center text-xl font-semibold">
        {children}
      </div>
    </div>
  )
}
