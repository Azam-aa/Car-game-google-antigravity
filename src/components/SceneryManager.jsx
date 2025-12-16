import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGame } from '../context/GameContext'

const Tree = ({ position }) => (
    <group position={position}>
        <mesh position={[0, 2, 0]}>
            <coneGeometry args={[1.5, 4, 8]} />
            <meshStandardMaterial color="#1a5a1a" />
        </mesh>
        <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 2]} />
            <meshStandardMaterial color="#5c4033" />
        </mesh>
    </group>
)

export const SceneryManager = () => {
    const { status, playerRef } = useGame()
    const lastSpawnZ = useRef(0)
    const [items, setItems] = useState([])

    useEffect(() => {
        if (status === 'playing') {
            setItems([])
            lastSpawnZ.current = playerRef.current?.position.z - 100
        }
    }, [status])

    useFrame(() => {
        if (status !== 'playing' && status !== 'menu') return
        const playerZ = playerRef.current?.position.z || 0

        // Spawn trees
        // Ensure we populate enough ahead
        if (lastSpawnZ.current > playerZ - 150) {
            // Need to spawn
            const z = playerZ - 150 - Math.random() * 20
            const leftX = -20 - Math.random() * 30
            const rightX = 20 + Math.random() * 30

            setItems(prev => [
                ...prev.filter(i => i.z < playerZ + 50), // Cleanup items behind
                { id: Math.random(), x: leftX, z },
                { id: Math.random() + 1, x: rightX, z }
            ])
            lastSpawnZ.current = z
        }
    })

    return (
        <group>
            {items.map(item => (
                <Tree key={item.id} position={[item.x, 0, item.z]} />
            ))}
        </group>
    )
}
