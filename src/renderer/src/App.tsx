function App(): React.JSX.Element {
  return (
    <div className="flex flex-col h-screen select-none">
      {/* 드래그 핸들 — 이 영역 잡고 창 이동 */}
      <div
        className="w-full h-6 flex items-center justify-center cursor-grab active:cursor-grabbing"
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      >
        <div className="w-12 h-1 bg-white/30 rounded-full" />
      </div>

      {/* 오버레이 콘텐츠 영역 */}
      <div
        className="flex-1 flex items-center px-4 gap-4 justify-center"
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      >
        <p className="text-white text-sm">🐾 FocusPot</p>
      </div>
    </div>
  )
}

export default App
