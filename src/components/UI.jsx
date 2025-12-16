import { useGame } from '../context/GameContext'

export const UI = () => {
    const { status, score, time, startGame, dayNight, toggleDayNight } = useGame()

    if (status === 'menu') {
        return (
            <div
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white z-50 pointer-events-auto"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.8)' }}
            >
                <h1 className="text-6xl md:text-8xl font-black mb-8 text-transparent bg-clip-text bg-gradient-to-br from-yellow-400 to-red-600 italic tracking-tighter drop-shadow-lg">
                    TURBO RACER
                </h1>
                <p className="mb-8 text-xl text-gray-300">Use Arrow Keys to Drive</p>
                <button
                    onClick={startGame}
                    className="px-10 py-4 bg-red-600 hover:bg-red-700 text-2xl font-bold rounded-full transition-all hover:scale-110 shadow-lg shadow-red-600/50"
                >
                    START RACE
                </button>
            </div>
        )
    }

    if (status === 'gameover') {
        return (
            <div
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 text-white z-50 pointer-events-auto"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.9)' }}
            >
                <h1 className="text-6xl font-black mb-4 text-white">GAME OVER</h1>
                <div className="text-4xl mb-8 font-mono text-yellow-400">Score: {score}</div>
                <button
                    onClick={startGame}
                    className="px-8 py-4 bg-green-600 hover:bg-green-700 text-xl font-bold rounded-lg shadow-lg hover:scale-105 transition-all"
                >
                    TRY AGAIN
                </button>
            </div>
        )
    }

    return (
        <div
            className="absolute inset-0 pointer-events-none z-40 flex flex-col justify-between p-6"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none' }}
        >
            {/* Top Bar */}
            <div className="flex justify-between items-start">
                <div className="pointer-events-auto">
                    <button
                        onClick={toggleDayNight}
                        className="px-4 py-2 bg-slate-800/80 backdrop-blur text-white rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors font-medium"
                    >
                        {dayNight === 'day' ? '🌙 Night' : '☀️ Day'}
                    </button>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <div className="px-6 py-2 bg-slate-900/80 backdrop-blur rounded-xl border border-slate-700 flex items-center gap-4">
                        <span className="text-sm text-slate-400 uppercase tracking-wider font-bold">Time</span>
                        <span className={`text-3xl font-mono font-bold ${time < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                            {time}
                        </span>
                    </div>
                    <div className="px-6 py-2 bg-slate-900/80 backdrop-blur rounded-xl border border-slate-700 flex items-center gap-4">
                        <span className="text-sm text-slate-400 uppercase tracking-wider font-bold">Score</span>
                        <span className="text-3xl font-mono font-bold text-yellow-400">
                            {score}
                        </span>
                    </div>
                </div>
            </div>

            {/* Bottom overlay (optional) */}
            <div className="w-full text-center opacity-50 text-white text-sm font-light">
                Arrow Keys to Steer
            </div>
        </div>
    )
}
