import { toast } from "sonner";
import { ValidChainType } from "@/lib/constants";

export function showTransactionToast(txHash: string, chainID: ValidChainType) {
  const isTestnet = chainID === 11155111;

  const explorerUrl = isTestnet
    ? `https://sepolia.etherscan.io/tx/${txHash}`
    : `https://basescan.org/tx/${txHash}`;

  const explorerName = isTestnet ? "EtherScan" : "BaseScan";

  toast.success(
    <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 sm:space-x-4">
      <div>
        <p className="font-semibold mb-1 text-sm sm:text-base">Transaction Submitted!</p>
        <a
          href={explorerUrl}
          className="text-blue-600 underline text-sm sm:text-base"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on {explorerName}
        </a>
      </div>
    </div>,
    {
      duration: 30_000, // Toast stays for 30 seconds
      dismissible: true, // Ensures close button is visible
    }
  );
}
