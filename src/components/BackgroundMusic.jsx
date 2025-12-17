import { useEffect, useRef } from 'react'
import { useGame } from '../context/GameContext'

export const BackgroundMusic = () => {
    const { status } = useGame()
    const audioRef = useRef(null)

    useEffect(() => {
        // Initialize audio once
        audioRef.current = new Audio('/bgm.mp3')
        audioRef.current.loop = true
        audioRef.current.volume = 0.5 // Reasonable default volume

        return () => {
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current = null
            }
        }
    }, [])

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        if (status === 'playing') {
            // Try to play
            const playPromise = audio.play()
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error("Audio autoplay failed:", error)
                })
            }
        } else {
            // Stop/Pause and Reset
            audio.pause()
            audio.currentTime = 0
        }
    }, [status])

    return null // Invisible component
}
