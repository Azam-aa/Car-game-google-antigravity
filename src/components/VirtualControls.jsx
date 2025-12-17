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
        // Dispatch detailed event for maximum compatibility
        const event = new KeyboardEvent(type, {
            key: key,
            code: key,
            keyCode: key === 'ArrowUp' ? 38 : key === 'ArrowDown' ? 40 : key === 'ArrowLeft' ? 37 : 39,
            bubbles: true,
            cancelable: true
        })
        window.dispatchEvent(event)
    }

    const handlePointerDown = (key) => (e) => {
        e.preventDefault()
        e.stopPropagation() // Stop event bubbling
        triggerKey(key, 'keydown')
    }

    const handlePointerUp = (key) => (e) => {
        e.preventDefault()
        e.stopPropagation()
        triggerKey(key, 'keyup')
    }

    const handlePointerLeave = (key) => (e) => {
        // Safety: if you drag finger off button, stop the action
        e.preventDefault()
        triggerKey(key, 'keyup')
    }

    return (
        <div className="absolute bottom-8 left-0 right-0 px-8 pb-8 flex justify-between items-end pointer-events-auto z-50 select-none">
            {/* Left Side: Gas & Brake (Left Thumb) */}
            <div className="flex gap-6 items-end">
                <button
                    className="w-24 h-24 bg-gray-300/80 backdrop-blur-md rounded-2xl border-4 border-gray-400 active:bg-gray-400 active:scale-95 transition-all flex flex-col items-center justify-center shadow-xl touch-none"
                    onPointerDown={handlePointerDown('ArrowDown')}
                    onPointerUp={handlePointerUp('ArrowDown')}
                    onPointerLeave={handlePointerLeave('ArrowDown')}
                >
                    <span className="font-black text-gray-800 text-lg uppercase tracking-wider">Brake</span>
                </button>
                <button
                    className="w-28 h-28 bg-gray-200/90 backdrop-blur-md rounded-2xl border-4 border-gray-400 active:bg-gray-400 active:scale-95 transition-all flex flex-col items-center justify-center shadow-xl touch-none"
                    onPointerDown={handlePointerDown('ArrowUp')}
                    onPointerUp={handlePointerUp('ArrowUp')}
                    onPointerLeave={handlePointerLeave('ArrowUp')}
                >
                    <span className="font-black text-gray-800 text-xl uppercase tracking-wider">GAS</span>
                </button>
            </div>

            {/* Right Side: Steering (Right Thumb) */}
            <div className="flex gap-6 items-end">
                <button
                    className="w-24 h-24 bg-gray-300/80 backdrop-blur-md rounded-full border-4 border-gray-400 active:bg-gray-400 active:scale-95 transition-all flex items-center justify-center shadow-xl touch-none"
                    onPointerDown={handlePointerDown('ArrowLeft')}
                    onPointerUp={handlePointerUp('ArrowLeft')}
                    onPointerLeave={handlePointerLeave('ArrowLeft')}
                >
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
                <button
                    className="w-24 h-24 bg-gray-300/80 backdrop-blur-md rounded-full border-4 border-gray-400 active:bg-gray-400 active:scale-95 transition-all flex items-center justify-center shadow-xl touch-none"
                    onPointerDown={handlePointerDown('ArrowRight')}
                    onPointerUp={handlePointerUp('ArrowRight')}
                    onPointerLeave={handlePointerLeave('ArrowRight')}
                >
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1f2937" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 18l6-6-6-6" />
                    </svg>
                </button>
            </div>
        </div>
    )
}
