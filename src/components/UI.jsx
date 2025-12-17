import { useState } from 'react'
import { useGame } from '../context/GameContext'
import { VirtualControls } from './VirtualControls'

export const UI = () => {
    const { status, score, highScore, time, initialTime, startGame, dayNight } = useGame()
    const [customTime, setCustomTime] = useState(5) // Default custom minutes

    const handleStart = (minutes) => {
        startGame(minutes * 60)
    }

    // Common overlay style for full screen centering
    // Inline styles added as fallback to ensure visibility if Tailwind confuses the layout engine
    const overlayStyle = "fixed inset-0 flex flex-col items-center justify-center z-50 select-none bg-black/80 backdrop-blur-sm"
    const inlineOverlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(5px)'
    }

    if (status === 'menu') {
        return (
            <div className={overlayStyle} style={inlineOverlayStyle}>
                {/* Title Section */}
                <div className="text-center mb-12 animate-fade-in-down">
                    <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 italic tracking-tighter filter drop-shadow-[0_0_10px_rgba(255,0,0,0.5)] mb-2">
                        AZAM CAR GAME
                    </h1>
                    <p className="text-xl md:text-2xl text-slate-300 font-light tracking-[0.5em] uppercase">
                        Ultimate Racing Experience
                    </p>
                </div>

                {/* Duration Selection */}
                <div className="flex flex-col items-center gap-12 w-full max-w-2xl px-4" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem', width: '100%', maxWidth: '42rem', padding: '0 1rem' }}>
                    <div className="flex gap-8 w-full justify-center" style={{ display: 'flex', gap: '2rem', justifyContent: 'center', width: '100%' }}>
                        <button
                            onClick={() => handleStart(5)}
                            className="flex-1 max-w-[200px] py-6 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl hover:border-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:-translate-y-1 transition-all duration-300 group"
                            style={{ flex: 1, maxWidth: '200px', padding: '1.5rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', cursor: 'pointer', margin: '0 10px' }}
                        >
                            <span className="block text-4xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors" style={{ display: 'block', fontSize: '2.25rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>5</span>
                            <span className="text-sm text-slate-500 font-bold tracking-widest uppercase" style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 'bold', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Minutes</span>
                        </button>

                        <button
                            onClick={() => handleStart(10)}
                            className="flex-1 max-w-[200px] py-6 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl hover:border-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:-translate-y-1 transition-all duration-300 group"
                            style={{ flex: 1, maxWidth: '200px', padding: '1.5rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem', cursor: 'pointer', margin: '0 10px' }}
                        >
                            <span className="block text-4xl font-bold text-white mb-2 group-hover:text-red-400 transition-colors" style={{ display: 'block', fontSize: '2.25rem', fontWeight: 'bold', color: 'white', marginBottom: '0.5rem' }}>10</span>
                            <span className="text-sm text-slate-500 font-bold tracking-widest uppercase" style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 'bold', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Minutes</span>
                        </button>
                    </div>

                    {/* Custom Input */}
                    <div className="flex items-center gap-6 bg-slate-900/90 p-4 pr-4 pl-8 rounded-full border border-slate-700 shadow-2xl" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(15, 23, 42, 0.9)', padding: '1rem 1rem 1rem 2rem', borderRadius: '9999px', border: '1px solid #334155', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                        <span className="text-slate-400 font-bold uppercase text-sm tracking-wider" style={{ color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '0.05em' }}>Custom Duration</span>
                        <div className="h-10 w-px bg-slate-700 mx-2" style={{ height: '2.5rem', width: '1px', backgroundColor: '#334155', margin: '0 0.5rem' }}></div>
                        <input
                            type="number"
                            min="1"
                            max="60"
                            value={customTime}
                            onChange={(e) => setCustomTime(Number(e.target.value))}
                            className="w-20 bg-transparent text-center text-3xl font-bold text-white focus:outline-none focus:text-red-400 transition-colors"
                            style={{ width: '5rem', background: 'transparent', textAlign: 'center', fontSize: '1.875rem', fontWeight: 'bold', color: 'white', outline: 'none', border: 'none' }}
                        />
                        <span className="text-slate-500 font-bold uppercase text-sm mr-2" style={{ color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.875rem', marginRight: '0.5rem' }}>MIN</span>
                        <button
                            onClick={() => handleStart(customTime)}
                            className="px-10 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-full shadow-lg hover:shadow-red-500/30 transition-all hover:scale-105"
                            style={{ padding: '1rem 2.5rem', backgroundColor: '#dc2626', color: 'white', fontWeight: 'bold', borderRadius: '9999px', cursor: 'pointer', border: 'none', marginLeft: '1rem' }}
                        >
                            START
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (status === 'gameover') {
        return (
            <div className={overlayStyle} style={inlineOverlayStyle}>
                <h1 className="text-7xl md:text-9xl font-black mb-8 text-white italic tracking-tighter drop-shadow-2xl">
                    GAME OVER
                </h1>

                <div className="flex gap-12 mb-12 items-end">
                    <div className="flex flex-col items-center">
                        <span className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-2">Final Score</span>
                        <span className="text-6xl font-mono font-black text-yellow-400 drop-shadow-md">{score}</span>
                    </div>
                    <div className="w-px h-24 bg-gradient-to-b from-transparent via-slate-600 to-transparent"></div>
                    <div className="flex flex-col items-center">
                        <span className="text-sm text-slate-400 uppercase tracking-widest font-bold mb-2">High Score</span>
                        <span className="text-6xl font-mono font-black text-white drop-shadow-md">{highScore}</span>
                    </div>
                </div>

                <div className="flex gap-6">
                    <button
                        onClick={() => startGame(initialTime)}
                        className="px-10 py-4 bg-green-600 hover:bg-green-500 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-green-500/30 hover:scale-105 transition-all uppercase tracking-wider"
                    >
                        Try Again
                    </button>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-10 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xl font-bold rounded-xl border border-slate-600 hover:border-slate-500 shadow-lg hover:scale-105 transition-all uppercase tracking-wider"
                    >
                        Main Menu
                    </button>
                </div>
            </div>
        )
    }

    // In-game HUD
    return (
        <div
            className="fixed inset-0 pointer-events-none z-40 flex flex-col justify-between p-6 select-none"
            style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 40, pointerEvents: 'none' }}
        >
            {/* Top HUD */}
            <div className="w-full flex justify-center pt-4">
                <div className="flex gap-8 bg-black/60 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/10 shadow-2xl">
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Time Remaining</span>
                        <span className={`text-4xl font-mono font-black ${time < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                            {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
                        </span>
                    </div>
                    <div className="w-px h-full bg-white/10"></div>
                    <div className="flex flex-col items-center">
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Score</span>
                        <span className="text-4xl font-mono font-black text-yellow-400">
                            {score}
                        </span>
                    </div>
                </div>
            </div>

            {/* Bottom Controls (Mobile Only via Component) */}
            <VirtualControls />
        </div>
    )
}
