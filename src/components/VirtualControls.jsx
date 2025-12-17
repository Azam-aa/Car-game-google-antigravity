import { useEffect, useState } from 'react'

export const VirtualControls = () => {
    // Only show on touch devices or small screens
    const [isTouch, setIsTouch] = useState(false)

    useEffect(() => {
        const checkTouch = () => {
            if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
                setIsTouch(true)
            }
        }
        checkTouch()
        window.addEventListener('resize', checkTouch)
        return () => window.removeEventListener('resize', checkTouch)
    }, [])

    const triggerKey = (key, type) => {
        const event = new KeyboardEvent(type, { key, bubbles: true })
        window.dispatchEvent(event)
    }

    const handleTouchStart = (key) => (e) => {
        e.preventDefault() // Prevent scroll/zoom
        triggerKey(key, 'keydown')
    }

    const handleTouchEnd = (key) => (e) => {
        e.preventDefault()
        triggerKey(key, 'keyup')
    }

    // Force show for now as per "Mobile Support" requirement to ensure it works
    // We can hide it on large screens via CSS hidden md:hidden

    return (
        <div className="absolute bottom-8 left-0 right-0 px-4 pb-4 flex justify-between items-end pointer-events-auto z-50 select-none">
            {/* Left/Right Controls */}
            <div className={`flex gap-4 ${isTouch ? '' : 'md:hidden'}`}>
                <button
                    className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full border-2 border-white/30 active:bg-white/40 active:scale-95 transition-all flex items-center justify-center"
                    onTouchStart={handleTouchStart('ArrowLeft')}
                    onTouchEnd={handleTouchEnd('ArrowLeft')}
                    onMouseDown={handleTouchStart('ArrowLeft')} // For testing on desktop
                    onMouseUp={handleTouchEnd('ArrowLeft')}
                >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
                <button
                    className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full border-2 border-white/30 active:bg-white/40 active:scale-95 transition-all flex items-center justify-center"
                    onTouchStart={handleTouchStart('ArrowRight')}
                    onTouchEnd={handleTouchEnd('ArrowRight')}
                    onMouseDown={handleTouchStart('ArrowRight')}
                    onMouseUp={handleTouchEnd('ArrowRight')}
                >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </button>
            </div>

            {/* Brake/Gas Control */}
            <div className="flex gap-4">
                <button
                    className="w-16 h-16 bg-red-500/30 backdrop-blur-md rounded-full border-2 border-red-400 active:bg-red-500/60 active:scale-95 transition-all flex items-center justify-center"
                    onTouchStart={handleTouchStart('ArrowDown')}
                    onTouchEnd={handleTouchEnd('ArrowDown')}
                    onMouseDown={handleTouchStart('ArrowDown')}
                    onMouseUp={handleTouchEnd('ArrowDown')}
                >
                    <span className="font-bold text-white text-xs uppercase">Brake</span>
                </button>
                <button
                    className="w-24 h-24 bg-green-500/30 backdrop-blur-md rounded-full border-2 border-green-400 active:bg-green-500/60 active:scale-95 transition-all flex items-center justify-center"
                    onTouchStart={handleTouchStart('ArrowUp')}
                    onTouchEnd={handleTouchEnd('ArrowUp')}
                    onMouseDown={handleTouchStart('ArrowUp')}
                    onMouseUp={handleTouchEnd('ArrowUp')}
                >
                    <span className="font-bold text-white text-sm uppercase">GAS</span>
                </button>
            </div>
        </div>
    )
}
