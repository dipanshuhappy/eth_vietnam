'use client'

import { useEffect, useState } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'

export function useFarcasterMiniApp() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isMiniApp, setIsMiniApp] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const initializeFarcaster = async () => {
      try {
        const miniAppDetected = await sdk.isInMiniApp()
        setIsMiniApp(miniAppDetected)

        if (miniAppDetected) {
          await sdk.actions.ready()
          console.log('Farcaster Mini App ready() called successfully')
        }

        setIsInitialized(true)
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to initialize Farcaster Mini App')
        setError(error)
        console.error('Failed to initialize Farcaster Mini App:', error)
        setIsInitialized(true) // Still mark as initialized even if failed
      }
    }

    initializeFarcaster()
  }, [])

  return {
    isInitialized,
    isMiniApp,
    error,
    sdk: isMiniApp ? sdk : null
  }
}
