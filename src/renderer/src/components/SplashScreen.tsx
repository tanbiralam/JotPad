import appIcon from '@/assets/icon.png'
import { useEffect, useState } from 'react'

interface SplashScreenProps {
  onFinished: () => void
}

const SPLASH_DURATION = 2500 // ms for progress bar
const FADE_OUT_DURATION = 500 // ms for exit animation

export const SplashScreen = ({ onFinished }: SplashScreenProps) => {
  const [fadingOut, setFadingOut] = useState(false)

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadingOut(true), SPLASH_DURATION)
    const removeTimer = setTimeout(() => onFinished(), SPLASH_DURATION + FADE_OUT_DURATION)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(removeTimer)
    }
  }, [onFinished])

  return (
    <div
      className={`splash-overlay ${fadingOut ? 'splash-fade-out' : ''}`}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--ios-bg)',
        transition: `opacity ${FADE_OUT_DURATION}ms ease, transform ${FADE_OUT_DURATION}ms ease`
      }}
    >
      {/* Logo */}
      <img
        src={appIcon}
        alt="JotPad"
        className="splash-logo"
        style={{
          width: 96,
          height: 96,
          borderRadius: 22,
          marginBottom: 28,
          boxShadow: '0 8px 40px rgba(10, 132, 255, 0.25)'
        }}
      />

      {/* App name */}
      <h1
        className="splash-title"
        style={{
          fontSize: 32,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: 'var(--ios-text)',
          margin: 0,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        }}
      >
        JotPad
      </h1>

      {/* Tagline */}
      <p
        className="splash-tagline"
        style={{
          fontSize: 14,
          color: 'var(--ios-text-secondary)',
          marginTop: 8,
          fontWeight: 400,
          letterSpacing: '0.01em'
        }}
      >
        Your thoughts, beautifully organized
      </p>

      {/* Progress bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          width: 180,
          height: 3,
          borderRadius: 3,
          background: 'var(--ios-separator)',
          overflow: 'hidden'
        }}
      >
        <div
          className="splash-progress-bar"
          style={{
            height: '100%',
            borderRadius: 3,
            background: 'var(--ios-accent)',
            animationDuration: `${SPLASH_DURATION}ms`
          }}
        />
      </div>
    </div>
  )
}
