import { ReactNode } from 'react'

interface DraggableLayoutProps {
  children: ReactNode
  className?: string
}

function DraggableLayout({ children, className = '' }: DraggableLayoutProps): React.JSX.Element {
  return (
    <div className="flex h-screen select-none flex-col overflow-hidden rounded-[24px] border border-cream-300 bg-cream-50 text-ink">
      <div className="drag flex h-7 w-full shrink-0 cursor-grab items-center justify-center active:cursor-grabbing">
        <div className="h-1 w-10 rounded-full bg-ink/10" />
      </div>

      <div className={`no-drag flex flex-1 flex-col ${className}`}>{children}</div>
    </div>
  )
}

export default DraggableLayout
