import { cn } from '@/utils/css'
import { ReactNode } from 'react'

interface ButtonComponentProps {
  type?: 'primary' | undefined | ''
  className?: string | undefined
  onClick: () => void
  children?: ReactNode
  attributes?: React.ButtonHTMLAttributes<HTMLButtonElement>
}

export function ButtonComponent({
  attributes,
  className,
  type,
  onClick,
  children,
}: ButtonComponentProps) {
  return (
    <button
      className={cn(
        'h-14 cursor-pointer text-center',
        type == 'primary'
          ? `bg-[#25F4F4] text-white font-bold border-2 border-[#25F4F4] rounded-[10] shadow-[0px_4px_8px_#0000000F,0px_0px_0px_#25F4F433]
          active:text-[#25F4F4] active:bg-[#fff]`
          : `bg-transparent text-[#171C1C] border-1 border-[#171C1C] rounded-[10]
          active:text-[#fff] active:bg-[#171C1C]`,
        'focus: ',
        className!,
      )}
      onClick={onClick}
      {...attributes}
    >
      {children}
    </button>
  )
}
