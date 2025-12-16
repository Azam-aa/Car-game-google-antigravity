import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGame } from '../context/GameContext'

export const Track = () => {
    // We can simulate infinite track by moving the texture or moving segments.
    // For simplicity with Camera movement, we can create a very long track segment 
    // and just tile the texture, or loop segments. The camera is moving in -Z.

    // Let's create a dynamic ground that follows the camera Z but snaps to grid to fake infinity.
    const groundRef = useRef()

    useFrame((state) => {
        if (!groundRef.current) return
        // Lock ground to camera position exactly to prevent gaps
        const camZ = state.camera.position.z
        const camX = state.camera.position.x
        groundRef.current.position.z = camZ
        groundRef.current.position.x = camX
    })

    return (
        <group ref={groundRef}>
            {/* Main Road - Giant plane to cover everything nearby */}
            <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, -50]}>
                <planeGeometry args={[100, 300]} />
                <meshStandardMaterial color="#333" />
            </mesh>

            {/* Dashed Line */}
            <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -50]}>
                <planeGeometry args={[0.5, 300]} />
                <meshStandardMaterial color="white" />
            </mesh>

            {/* Grass/Offroad */}
            <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
                <planeGeometry args={[1000, 1000]} />
                <meshStandardMaterial color="#1a3a1a" />
            </mesh>

            {/* Side Objects (Simple Trees/Buildings) to show speed */}
            {/* We manually place a few rows that will just loop with the ground since ground follows camera */}
            {/* Actually, if ground follows camera, strict static children will move WITH camera and look static. */}
            {/* We need these objects to stay fixed in world space or spawn like obstacles. */}
            {/* Let's use a trick: The texture on ground doesn't move, so we feel speed. */}
            {/* If we want objects, we should spawn them in ObstacleManager or a SceneryManager. */}
            {/* But for simplicity, let's just create a GridHelper or heavily textured plane. */}
            <gridHelper args={[1000, 100, 0x555555, 0x222222]} position={[0, 0.01, 0]} rotation={[0, 0, 0]} />
        </group>
    )
}
