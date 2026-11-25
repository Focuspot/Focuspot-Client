import { app, shell, BrowserWindow, ipcMain, powerMonitor, screen } from 'electron'
import { join } from 'path'
import { readFileSync, writeFileSync } from 'fs'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'

// ── 창 위치 기억 ──────────────────────────────────────────
type WindowMode = 'setup' | 'overlay'
type Point = { x: number; y: number }

const SIZES: Record<WindowMode, { width: number; height: number }> = {
  setup: { width: 420, height: 680 },
  overlay: { width: 180, height: 240 }
}

const statePath = (): string => join(app.getPath('userData'), 'window-state.json')

function loadPositions(): Partial<Record<WindowMode, Point>> {
  try {
    return JSON.parse(readFileSync(statePath(), 'utf-8'))
  } catch {
    return {}
  }
}

function savePositions(positions: Partial<Record<WindowMode, Point>>): void {
  try {
    writeFileSync(statePath(), JSON.stringify(positions))
  } catch {
    // ignore
  }
}

/** 저장된 위치가 현재 연결된 모니터 안에 있을 때만 사용 */
function isVisible(pos: Point, mode: WindowMode): boolean {
  const { width, height } = SIZES[mode]
  return screen.getAllDisplays().some(({ workArea: a }) => {
    const cx = pos.x + width / 2
    const cy = pos.y + height / 2
    return cx >= a.x && cx <= a.x + a.width && cy >= a.y && cy <= a.y + a.height
  })
}

function defaultPosition(mode: WindowMode): Point {
  const a = screen.getPrimaryDisplay().workArea
  const { width, height } = SIZES[mode]
  if (mode === 'overlay') return { x: a.x + a.width - width - 24, y: a.y + 24 } // 오른쪽 위
  return {
    x: Math.round(a.x + (a.width - width) / 2),
    y: Math.round(a.y + (a.height - height) / 2)
  }
}

function createWindow(): void {
  const positions = loadPositions()
  let mode: WindowMode = 'setup'
  const positionFor = (m: WindowMode): Point => {
    const saved = positions[m]
    return saved && isVisible(saved, m) ? saved : defaultPosition(m)
  }
  const setupPos = positionFor('setup')

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    ...SIZES.setup,
    ...setupPos,
    alwaysOnTop: true,
    transparent: true,
    frame: false,
    resizable: false,
    hasShadow: false,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  const switchMode = (next: WindowMode): void => {
    if (mode === next) return
    mode = next
    mainWindow.setBounds({ ...SIZES[next], ...positionFor(next) })
  }

  // 사용자가 창을 옮기면 모드별로 위치 저장
  let saveTimer: ReturnType<typeof setTimeout> | null = null
  mainWindow.on('moved', () => {
    const [x, y] = mainWindow.getPosition()
    positions[mode] = { x, y }
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(() => savePositions(positions), 300)
  })

  // 잠자기/화면 잠금 시 타이머 자동 일시정지
  const pauseTimer = (): void => mainWindow.webContents.send('system-pause')
  powerMonitor.on('suspend', pauseTimer)
  powerMonitor.on('lock-screen', pauseTimer)
  mainWindow.on('closed', () => {
    powerMonitor.off('suspend', pauseTimer)
    powerMonitor.off('lock-screen', pauseTimer)
  })

  ipcMain.on('resize-overlay', () => switchMode('overlay'))
  ipcMain.on('resize-setup', () => switchMode('setup'))
  ipcMain.on('resize-result', () => switchMode('setup'))
  ipcMain.on('quit-app', () => app.quit())

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
