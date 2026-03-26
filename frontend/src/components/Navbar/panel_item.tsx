'use client'

import Link from 'next/link'
import { ReactNode } from 'react'

interface PanelItemProps {
  active: boolean
  children?: ReactNode
  name: string
  onClick: () => void
  path: string
}
export function PanelItem({
  active,
  children,
  name,
  onClick,
  path,
}: PanelItemProps) {
  return (
    <Link
      className={`p-4 h-12 flex items-center gap-4 text-sm 
                border-2 border-transparent font-medium
                hover:bg-none hover:border-purple-300 
                ${active ? 'bg-[#25F4F41A] bg-opacity-50 rounded-[10] text-[#25F4F4]' : 'text-[#546464]'}
                focus:border-transparent focus:rounded-[10]`}
      href={path}
      onClick={onClick}
    >
      <div className="flex gap-2 items-center">
        {children}
        {name}
      </div>
    </Link>
  )
}
