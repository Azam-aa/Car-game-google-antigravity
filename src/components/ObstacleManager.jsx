import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGame } from '../context/GameContext'

const Obstacle = ({ position }) => {
    return (
        <group position={position}>
            {/* Cone Obstacle */}
            <mesh castShadow position={[0, 0.5, 0]}>
                <coneGeometry args={[0.5, 1, 16]} />
                <meshStandardMaterial color="orange" />
            </mesh>
        </group>
    )
}

export const ObstacleManager = () => {
    const { status, endGame, setScore, playerRef } = useGame()
    const lastSpawnZ = useRef(0)

    // Store active obstacles
    const [obstacles, setObstacles] = useState([])

    // Reset obstacles when game starts
    useEffect(() => {
        if (status === 'playing') {
            setObstacles([])
            lastSpawnZ.current = playerRef.current.position.z - 50 // Start spawning a bit ahead
        }
    }, [status])

    useFrame((state) => {
        if (status !== 'playing') return

        // Use Global Player Pos
        const playerPos = playerRef.current.position

        // 1. Spawning
        // Spawn ahead (always negative z)
        // Maintain a buffer ahead of the player: player is at -100, we want to spawn at -250.
        // lastSpawnZ grows more negative.
        // If lastSpawnZ is > playerPos.z - 100 (e.g. -50 > -100), we need to spawn more.
        if (lastSpawnZ.current > playerPos.z - 100) {
            // Spawn a batch
            const spawnZ = playerPos.z - 120 - (Math.random() * 50)
            const spawnX = (Math.random() * 10) - 5
            setObstacles(prev => [...prev, { id: Math.random(), x: spawnX, z: spawnZ, passed: false }])
            lastSpawnZ.current = spawnZ
        }

        if (playerPos.z < lastSpawnZ.current + 20) { // If player gets close to last spawn point
            const spawnZ = lastSpawnZ.current - 20 - (Math.random() * 30) // Spawn 20-50 units further
            const spawnX = (Math.random() * 10) - 5 // Wider spawn area
            setObstacles(prev => [...prev, { id: Math.random(), x: spawnX, z: spawnZ, passed: false }])
            lastSpawnZ.current = spawnZ
        }

        // 2. Collision & Score
        setObstacles(prev => {
            return prev.filter(obs => {
                // Remove if behind player
                if (obs.z > playerPos.z + 10) return false

                // Collision
                const dx = Math.abs(obs.x - playerPos.x)
                const dz = Math.abs(obs.z - playerPos.z)

                if (dx < 1.0 && dz < 1.5) { // Simple Box collision
                    endGame()
                }

                // Score
                if (!obs.passed && obs.z > playerPos.z + 2) {
                    obs.passed = true
                    setScore(s => s + 10)
                }

                return true
            })
        })
    })

    // Rendering logic only
    return (
        <>
            {obstacles.map(obs => (
                <Obstacle key={obs.id} position={[obs.x, 0, obs.z]} />
            ))}
        </>
    )
}
