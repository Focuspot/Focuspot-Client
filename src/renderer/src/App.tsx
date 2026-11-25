import { HashRouter, Routes, Route } from 'react-router-dom'
import StartScreen from './screens/StartScreen'
import RoomScreen from './screens/RoomScreen'
import ProfileSetup from './screens/ProfileSetup'
import OverlayMain from './screens/OverlayMain'
import ResultScreen from '@renderer/screens/ResultScreen'
import { useApplyTheme } from './hooks/useTheme'

function App(): React.JSX.Element {
  useApplyTheme()

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<StartScreen />} />
        <Route path="/room" element={<RoomScreen />} />
        <Route path="/profile" element={<ProfileSetup />} />
        <Route path="/overlay" element={<OverlayMain />} />
        <Route path="/result" element={<ResultScreen />} />
      </Routes>
    </HashRouter>
  )
}

export default App
