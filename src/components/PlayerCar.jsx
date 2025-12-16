import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGame } from '../context/GameContext'
import * as THREE from 'three'

export const PlayerCar = () => {
    const carRef = useRef()
    const { status, speed, playerRef, setSpeed } = useGame() // We need setSpeed to update global speed

    // Controls State
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
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
        }
    }, [])

    useFrame((state, delta) => {
        if (status !== 'playing' || !carRef.current) return

        // Manual Speed Control
        let currentSpeed = speed
        if (keys.current.up) {
            currentSpeed += 20 * delta // Accelerate
        } else {
            currentSpeed -= 10 * delta // Friction
        }

        if (keys.current.down) {
            currentSpeed -= 30 * delta // Brake
        }

        // Clamp speed
        currentSpeed = THREE.MathUtils.clamp(currentSpeed, 0, 100)

        // Update global speed for other components
        setSpeed(currentSpeed)

        carRef.current.position.z -= currentSpeed * delta

        // Horizontal Movement
        const moveSpeed = 15 * delta
        if (keys.current.left) {
            carRef.current.position.x -= moveSpeed
            carRef.current.rotation.y = THREE.MathUtils.lerp(carRef.current.rotation.y, 0.3, 0.1)
            carRef.current.rotation.z = THREE.MathUtils.lerp(carRef.current.rotation.z, 0.1, 0.1)
        } else if (keys.current.right) {
            carRef.current.position.x += moveSpeed
            carRef.current.rotation.y = THREE.MathUtils.lerp(carRef.current.rotation.y, -0.3, 0.1)
            carRef.current.rotation.z = THREE.MathUtils.lerp(carRef.current.rotation.z, -0.1, 0.1)
        } else {
            carRef.current.rotation.y = THREE.MathUtils.lerp(carRef.current.rotation.y, 0, 0.1)
            carRef.current.rotation.z = THREE.MathUtils.lerp(carRef.current.rotation.z, 0, 0.1)
        }

        // Constraints (Road Width approx 10 units wide, -5 to 5)
        carRef.current.position.x = THREE.MathUtils.clamp(carRef.current.position.x, -4.5, 4.5)

        // SYNC WITH CONTEXT FOR COLLISION
        if (playerRef.current) {
            playerRef.current.position.x = carRef.current.position.x
            playerRef.current.position.z = carRef.current.position.z
        }

        // Camera Follow
        state.camera.position.z = carRef.current.position.z + 10
        state.camera.position.y = 5 // Keep height fixed or slight bob
        state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, carRef.current.position.x / 2, 0.1)

        // Look slightly further ahead
        state.camera.lookAt(carRef.current.position.x, 0, carRef.current.position.z - 10)
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
