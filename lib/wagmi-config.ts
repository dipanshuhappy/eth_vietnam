"use client"
import { createConfig, http } from 'wagmi'
import { base, mainnet, sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector'
export const config = createConfig({
  chains: [base],
  connectors: [
    miniAppConnector()
  ],

  transports: {
    [base.id]: http(`https://base-mainnet.g.alchemy.com/v2/i0VnxDFKRiL1F8qF5HdtVo0OcILLv73d`)
  },
  // transports: {
  //   base: http(),
  // },
  ssr: true, // If your dApp uses server side rendering (SSR)
});
