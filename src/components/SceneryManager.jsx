import { useRef, useState, useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGame } from '../context/GameContext'
import * as THREE from 'three'

const Tree = ({ position }) => (
    <group position={position}>
        <mesh position={[0, 2, 0]} castShadow>
            <coneGeometry args={[1.5, 4, 8]} />
            <meshStandardMaterial color="#1a5a1a" />
        </mesh>
        <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 2]} />
            <meshStandardMaterial color="#5c4033" />
        </mesh>
    </group>
)

const Building = ({ position, height = 10, color = "#444" }) => {
    // Improve building look with "windows" (simple texture or geometry) - using simple emissive pattern via separate mesh? 
    // For performance, simple box with standard material is best, maybe some random emissive windows?
    // Let's keep it simple style: sleek skyscrapers.
    return (
        <group position={position}>
            <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
                <boxGeometry args={[4, height, 4]} />
                <meshStandardMaterial color={color} roughness={0.2} metalness={0.5} />
            </mesh>
            {/* Simple windows strip */}
            <mesh position={[0, height / 2, 2.05]}>
                <planeGeometry args={[0.2, height - 2]} />
                <meshStandardMaterial color="#ffffaa" emissive="#ffffaa" emissiveIntensity={0.5} />
            </mesh>
            <mesh position={[1, height / 2, 2.05]}>
                <planeGeometry args={[0.2, height - 2]} />
                <meshStandardMaterial color="#ffffaa" emissive="#ffffaa" emissiveIntensity={0.5} />
            </mesh>
            <mesh position={[-1, height / 2, 2.05]}>
                <planeGeometry args={[0.2, height - 2]} />
                <meshStandardMaterial color="#ffffaa" emissive="#ffffaa" emissiveIntensity={0.5} />
            </mesh>
        </group>
    )
}

export const SceneryManager = () => {
    const { status, playerRef } = useGame()
    const lastSpawnZ = useRef(0)
    const [items, setItems] = useState([])

    // Clear on start
    useEffect(() => {
        if (status === 'playing') {
            setItems([])
            // Start spawning from a bit ahead of default start position (0)
            // But we need IMMEDIATE environment, so spawn from +50 down to -200 initially
            let initialItems = []
            for (let z = 50; z > -300; z -= 20) {
                const isCity = Math.abs(z) > 1000 // Simple threshold
                // Wait, z is getting more negative.
                generateRow(z, initialItems)
            }
            setItems(initialItems)
            lastSpawnZ.current = -300
        }
    }, [status])

    const generateRow = (z, list) => {
        // Progressive Logic:
        // 0 to -500: Trees (Suburbs)
        // -500 to -1500: Mixed
        // <-1500: City

        const dist = Math.abs(z)
        let type = 'tree'
        if (dist > 1500) type = 'building'
        else if (dist > 500) type = Math.random() > 0.5 ? 'building' : 'tree'

        // Spawn Left and Right
        // Distance from road center
        const roadWidth = 10
        const minOffset = 10
        const range = 40

        const leftX = -minOffset - Math.random() * range
        const rightX = minOffset + Math.random() * range

        const id = Math.random()

        if (type === 'tree') {
            list.push({ id: id, x: leftX, z, type: 'tree' })
            list.push({ id: id + 0.1, x: rightX, z, type: 'tree' })
        } else {
            // Buildings variants
            const h1 = 10 + Math.random() * 20
            const c1 = Math.random() > 0.5 ? '#2a2a2a' : '#1a1a2e'

            const h2 = 10 + Math.random() * 20
            const c2 = Math.random() > 0.5 ? '#2a2a2a' : '#1a1a2e'

            list.push({ id: id, x: leftX, z, type: 'building', height: h1, color: c1 })
            list.push({ id: id + 0.1, x: rightX, z, type: 'building', height: h2, color: c2 })
        }
    }

    useFrame(() => {
        if (status !== 'playing' && status !== 'menu') return
        // Even in menu we might want some scenery if camera moves? 
        // But playerRef might be null or static. 
        // Lets stick to playing for generation.

        const playerZ = playerRef.current?.position.z || 0

        // Spawn logic
        // Maintain buffer ahead: 300 units
        if (lastSpawnZ.current > playerZ - 300) {
            const newItems = []
            let z = lastSpawnZ.current
            // Generate a batch
            while (z > playerZ - 350) {
                z -= 20 + Math.random() * 10
                generateRow(z, newItems)
            }

            lastSpawnZ.current = z

            setItems(prev => {
                // Cleanup items that are BEHIND camera too far
                // Camera is at playerZ + 10. Items at playerZ + 50 are safe to remove.
                const filtered = prev.filter(i => i.z < playerZ + 50)
                return [...filtered, ...newItems]
            })
        }
    })

    return (
        <group>
            {items.map(item => (
                item.type === 'tree' ?
                    <Tree key={item.id} position={[item.x, 0, item.z]} /> :
                    <Building key={item.id} position={[item.x, 0, item.z]} height={item.height} color={item.color} />
            ))}
        </group>
    )
}

