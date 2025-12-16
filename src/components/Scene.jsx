import { useGame } from '../context/GameContext'
import { OrbitControls } from '@react-three/drei'
import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { PlayerCar } from './PlayerCar'
import { Track } from './Track'
import { ObstacleManager } from './ObstacleManager'
import { SceneryManager } from './SceneryManager'

export const Scene = () => {
    const { dayNight } = useGame()

    const { scene } = useThree()

    useEffect(() => {
        const color = dayNight === 'day' ? '#87CEEB' : '#111111'
        scene.background = new THREE.Color(color)
        scene.fog = new THREE.Fog(color, 20, 100) // Increased fog distance
    }, [dayNight, scene])

    return (
        <>
            {/* <OrbitControls /> */}

            {/* Lights */}
            <ambientLight intensity={dayNight === 'day' ? 0.5 : 0.1} />
            <directionalLight
                position={[10, 10, 5]}
                intensity={dayNight === 'day' ? 1 : 0.2}
                castShadow
            />

            <Track />
            <SceneryManager />
            <PlayerCar />
            <ObstacleManager />
        </>
    )
}
