function ExitButton(): React.JSX.Element {
  const handleQuit = (): void => {
    window.electron.ipcRenderer.send('quit-app')
  }

  return (
    <button
      onClick={handleQuit}
      className="w-full py-3 rounded-xl border border-red-400/40 bg-red-400/10 text-red-300 text-sm font-medium hover:bg-red-400/20"
    >
      종료하기
    </button>
  )
}

export default ExitButton
