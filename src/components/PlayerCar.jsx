import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGame } from '../context/GameContext'
import * as THREE from 'three'

export const PlayerCar = () => {
    const carRef = useRef()
    const { status, speed: contextSpeed, playerRef, setSpeed } = useGame()

    // Physics State in Ref (to avoid re-renders)
    const speedRef = useRef(0)
    const keys = useRef({ left: false, right: false, up: false, down: false })

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'a') keys.current.left = true
            if (e.key === 'ArrowRight' || e.key === 'd') keys.current.right = true
            if (e.key === 'ArrowUp' || e.key === 'w') keys.current.up = true
            if (e.key === 'ArrowDown' || e.key === 's') keys.current.down = true
        }
        const handleKeyUp = (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'a') keys.current.left = false
            if (e.key === 'ArrowRight' || e.key === 'd') keys.current.right = false
            if (e.key === 'ArrowUp' || e.key === 'w') keys.current.up = false
            if (e.key === 'ArrowDown' || e.key === 's') keys.current.down = false
        }
        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)

        // Reset speed on mount/status change
        if (status === 'playing') {
            // Keep existing speed if restarting? No, reset ensures clean start.
            // But if we pause, we might want to keep it.
            // For now start fresh.
        } else {
            speedRef.current = 0
            setSpeed(0)
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [status, setSpeed])

    useFrame((state, delta) => {
        if (status !== 'playing' || !carRef.current) return

        // PHYSICS UPDATE
        let currentSpeed = speedRef.current

        // Acceleration / Braking
        if (keys.current.up) {
            currentSpeed += 40 * delta // Faster acceleration
        } else {
            // Natural Friction
            currentSpeed -= 15 * delta
        }

        if (keys.current.down) {
            currentSpeed -= 60 * delta // Strong braking
        }

        // Clamp Speed
        if (currentSpeed < 0) currentSpeed = 0
        if (currentSpeed > 100) currentSpeed = 100 // Max speed

        // Update Ref
        speedRef.current = currentSpeed

        // Update Context (Throttled or just direct if React handles it well, 
        // using Math.round to reduce updates can help)
        if (Math.abs(currentSpeed - contextSpeed) > 1) {
            setSpeed(Math.round(currentSpeed))
        }

        // Move Car Forward (Z axis negative)
        // distance = speed * time
        carRef.current.position.z -= currentSpeed * delta

        // Horizontal Movement
        const moveSpeed = 20 * delta
        // Only steer if moving (realistic) or allow steer always? 
        // Arcade games often allow steer even when stopped, but let's make it slightly dependent on speed for realism? 
        // User asked for "smooth and natural".
        // Let's keep it simple: constant steer speed but smooth lean.

        let targetRotY = 0
        let targetRotZ = 0

        if (keys.current.left) {
            carRef.current.position.x -= moveSpeed
            targetRotY = 0.3
            targetRotZ = 0.1
        } else if (keys.current.right) {
            carRef.current.position.x += moveSpeed
            targetRotY = -0.3
            targetRotZ = -0.1
        }

        // Smooth rotation
        carRef.current.rotation.y = THREE.MathUtils.lerp(carRef.current.rotation.y, targetRotY, 5 * delta)
        carRef.current.rotation.z = THREE.MathUtils.lerp(carRef.current.rotation.z, targetRotZ, 5 * delta)

        // Constraints (Road Width approx 12 units wide usually, -6 to 6, safe -5 to 5)
        carRef.current.position.x = THREE.MathUtils.clamp(carRef.current.position.x, -5, 5)

        // SYNC WITH CONTEXT FOR COLLISION
        if (playerRef.current) {
            playerRef.current.position.x = carRef.current.position.x
            playerRef.current.position.z = carRef.current.position.z
        }

        // Camera Follow
        state.camera.position.z = carRef.current.position.z + 10
        // Dynamic camera height based on speed?
        state.camera.position.y = 5 + (currentSpeed / 100) * 0.5

        // Smooth camera X follow (delayed)
        state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, carRef.current.position.x / 1.5, 3 * delta)

        // Look slightly further ahead based on speed
        state.camera.lookAt(
            carRef.current.position.x / 2,
            0,
            carRef.current.position.z - 10 - (currentSpeed * 0.1)
        )
    })

    return (
        <group ref={carRef} position={[0, 0.5, 0]}>
            {/* Lamborghini Style Body - Low Poly Wedge */}

            {/* Main Chassis */}
            <mesh position={[0, 0.3, 0]} castShadow>
                {/* Wedge shape: box with scale/rotation */}
                <boxGeometry args={[1.8, 0.5, 4]} />
                <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Cabin / Windshield */}
            <mesh position={[0, 0.7, -0.5]}>
                <boxGeometry args={[1.4, 0.5, 1.5]} />
                <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
            </mesh>

            {/* Spoiler */}
            <mesh position={[0, 0.8, 1.8]}>
                <boxGeometry args={[2, 0.1, 0.5]} />
                <meshStandardMaterial color="#111" />
            </mesh>
            <mesh position={[-0.8, 0.6, 1.8]}>
                <boxGeometry args={[0.1, 0.4, 0.2]} />
                <meshStandardMaterial color="#111" />
            </mesh>
            <mesh position={[0.8, 0.6, 1.8]}>
                <boxGeometry args={[0.1, 0.4, 0.2]} />
                <meshStandardMaterial color="#111" />
            </mesh>

            {/* Wheels - Wider and Lower */}
            <mesh position={[-0.9, 0, 1.2]}>
                <cylinderGeometry args={[0.35, 0.35, 0.4, 16]} rotation={[0, 0, Math.PI / 2]} />
                <meshStandardMaterial color="#222" />
            </mesh>
            <mesh position={[0.9, 0, 1.2]}>
                <cylinderGeometry args={[0.35, 0.35, 0.4, 16]} rotation={[0, 0, Math.PI / 2]} />
                <meshStandardMaterial color="#222" />
            </mesh>
            <mesh position={[-0.9, 0, -1.2]}>
                <cylinderGeometry args={[0.35, 0.35, 0.4, 16]} rotation={[0, 0, Math.PI / 2]} />
                <meshStandardMaterial color="#222" />
            </mesh>
            <mesh position={[0.9, 0, -1.2]}>
                <cylinderGeometry args={[0.35, 0.35, 0.4, 16]} rotation={[0, 0, Math.PI / 2]} />
                <meshStandardMaterial color="#222" />
            </mesh>

            {/* Headlights */}
            <mesh position={[-0.6, 0.4, -2.01]}>
                <planeGeometry args={[0.4, 0.2]} />
                <meshStandardMaterial color="#ccffcc" emissive="#ccffcc" emissiveIntensity={2} />
            </mesh>
            <mesh position={[0.6, 0.4, -2.01]}>
                <planeGeometry args={[0.4, 0.2]} />
                <meshStandardMaterial color="#ccffcc" emissive="#ccffcc" emissiveIntensity={2} />
            </mesh>

            {/* Spotlights */}
            <spotLight position={[0, 0.5, -1.8]} target-position={[0, 0, -20]} angle={0.6} penumbra={0.5} intensity={5} castShadow />
        </group>
    )
}

