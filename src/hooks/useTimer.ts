import { useState, useEffect, useRef } from 'react'

export function useTimer(totalSeconds: number, onExpire?: () => void) {
  const [secondsRemaining, setSecondsRemaining] = useState(totalSeconds)
  const onExpireRef = useRef(onExpire)
  onExpireRef.current = onExpire

  useEffect(() => {
    if (secondsRemaining <= 0) {
      onExpireRef.current?.()
      return
    }
    const id = setInterval(() => {
      setSecondsRemaining(s => {
        if (s <= 1) {
          clearInterval(id)
          onExpireRef.current?.()
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, []) // only run once on mount

  const minutes = Math.floor(secondsRemaining / 60)
  const seconds = secondsRemaining % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  const isWarning = secondsRemaining <= 300 // 5 minutes
  const isCritical = secondsRemaining <= 60
  const isExpired = secondsRemaining === 0

  return { secondsRemaining, formattedTime, isWarning, isCritical, isExpired }
}
