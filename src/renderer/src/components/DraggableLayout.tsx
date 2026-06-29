import { ReactNode } from 'react'

interface DraggableLayoutProps {
  children: ReactNode
  className?: string
}

function DraggableLayout({ children, className = '' }: DraggableLayoutProps): React.JSX.Element {
  return (
    <div className="flex flex-col h-screen bg-[#1a1a1f] select-none">
      <div
        className="w-full h-6 flex items-center justify-center cursor-grab active:cursor-grabbing shrink-0"
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      >
        <div className="w-12 h-1 bg-white/20 rounded-full" />
      </div>

      <div
        className={`flex flex-col flex-1 ${className}`}
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        {children}
      </div>
    </div>
  )
}

export default DraggableLayout
