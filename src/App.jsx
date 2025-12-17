import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { GameProvider, useGame } from './context/GameContext'
import { Scene } from './components/Scene'
import { UI } from './components/UI'

const GameCanvas = () => {
  return (
    <Canvas
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
      shadows
      camera={{ position: [0, 5, 10], fov: 50 }}
    >
      <color attach="background" args={['#87CEEB']} />
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  )
}

const AppWrapper = () => {
  return (
    <div className="relative bg-black overflow-hidden" style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div className="absolute inset-0 z-0" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
        <GameCanvas />
      </div>
      <UI />
    </div>
  )
}

function App() {
  return (
    <GameProvider>
      <AppWrapper />
    </GameProvider>
  )
}

export default App
