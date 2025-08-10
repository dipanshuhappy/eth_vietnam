'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from '@/lib/wagmi-config'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { useMounted } from '@/hooks/use-mounted'
import dynamic from 'next/dynamic'
import { BondLoadingModal } from './bond-loading-modal'

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  // const mounted = useMounted();
  // if (!mounted) return null;
  // const RainbowKitProvider = dynamic(
  //   () =>
  //     import("@rainbow-me/rainbowkit").then((mod) => mod.RainbowKitProvider),
  //   {
  //     loading: () => <BondLoadingModal />,
  //   },
  // );
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>
        {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}