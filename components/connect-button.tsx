'use client'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from "@/components/ui/button";

export function ConnectButton() {
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { isConnected, address } = useAccount()

  const handleConnect = () => {
    connect({ connector: connectors[0] }) // First connector is MetaMask
  }

  return (
    <div className="w-full flex flex-col items-center">
      {isConnected ? (
        <div className="flex flex-col items-center gap-4 w-full">
          <span className="text-primary-foreground font-medium">
            {address?.slice(0, 6)}...{address?.slice(-4)}
          </span>
          <Button 
            onClick={() => disconnect()}
            variant="destructive"
            className="w-full"
          >
            Disconnect
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleConnect}
          className="w-full py-6 text-lg font-semibold bg-primary hover:bg-blue-700 text-white transition-colors"
          size="lg"
        >
          Connect Wallet
        </Button>
      )}
    </div>
  )
}