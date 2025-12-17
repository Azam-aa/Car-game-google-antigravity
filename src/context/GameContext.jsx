import { createContext, useContext, useState, useRef, useEffect } from 'react'

const GameContext = createContext()

export const GameProvider = ({ children }) => {
    const [status, setStatus] = useState('menu') // menu, playing, gameover
    const [score, setScore] = useState(0)
    const [highScore, setHighScore] = useState(() => {
        const saved = localStorage.getItem('turboRacerHigh')
        return saved ? parseInt(saved, 10) : 0
    })
    const [time, setTime] = useState(60)
    const [initialTime, setInitialTime] = useState(300) // Default 5 mins (300s)
    const [dayNight, setDayNight] = useState('day') // day, night
    const [speed, setSpeed] = useState(0)

    // Use refs for values that change every frame to avoid re-renders if needed in loop
    const scoreRef = useRef(0)

    const startGame = (duration = 300) => {
        setScore(0)
        scoreRef.current = 0
        setInitialTime(duration)
        setTime(duration)
        setSpeed(0) // Start at 0, manual control
        setStatus('playing')
    }

    const endGame = () => {
        setStatus('gameover')
        setSpeed(0)
        if (score > highScore) {
            setHighScore(score)
            localStorage.setItem('turboRacerHigh', score)
        }
    }

    const toggleDayNight = () => {
        setDayNight(prev => prev === 'day' ? 'night' : 'day')
    }

    // Timer Logic
    useEffect(() => {
        let interval
        if (status === 'playing') {
            interval = setInterval(() => {
                setTime((prev) => {
                    if (prev <= 1) {
                        endGame()
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [status])

    // Shared ref for player position to enable collision checks across components
    const playerRef = useRef({ position: { x: 0, z: 0 }, bounds: { width: 1, depth: 2 } })

    return (
        <GameContext.Provider value={{
            status, setStatus,
            score, setScore,
            highScore,
            time, setTime,
            initialTime,
            dayNight, toggleDayNight,
            speed, setSpeed,
            startGame, endGame,
            scoreRef,
            playerRef
        }}>
            {children}
        </GameContext.Provider>
    )
}

export const useGame = () => useContext(GameContext)
