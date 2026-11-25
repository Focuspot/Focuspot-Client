function ExitButton(): React.JSX.Element {
  const handleQuit = (): void => {
    window.electron.ipcRenderer.send('quit-app')
  }

  return (
    <button onClick={handleQuit} className="btn-ghost">
      종료하기
    </button>
  )
}

export default ExitButton
