"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount, useReadContract } from "wagmi";
import { createPublicClient, erc20Abi, formatUnits, http, parseUnits } from "viem";
import { CONTRACT_ADDRESSES, NULL_ADDRESS, ValidChainType } from "@/lib/constants";
import { getChainId, waitForTransactionReceipt, writeContract } from "wagmi/actions";
import { config } from "@/lib/wagmi-config";
import { USER_FACTORY_ABI } from "@/abi/user-factory";
import { createBond } from "@/lib/calls";
import { isAddress } from "viem";
import { mainnet } from "viem/chains";
import { getEnsAddress, normalize } from "viem/ens";
import { showTransactionToast } from "../showTransactionToast";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BondLoadingModal } from "@/components/bond-loading-modal";
import { ArrowRight, EclipseIcon as Ethereum, DollarSign, Loader2 } from "lucide-react";
import { useChainId } from "wagmi";

export function OnBoardForm({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { address, isConnected } = useAccount();
  const [formData, setFormData] = useState({ user2: "", amount: "" });
  const [isLoading, setIsLoading] = useState(false);
  const chainId = useChainId();

  // Debug logging
  useEffect(() => {
    console.log("=== OnBoardForm Debug Info ===");
    console.log("Chain ID:", chainId);
    console.log("Address:", address);
    console.log("Is Connected:", isConnected);
    console.log("Contract Addresses for Chain:", CONTRACT_ADDRESSES[chainId as ValidChainType]);
    console.log("==============================");
  }, [chainId, address, isConnected]);

  // Validate that current chain is supported
  const isChainSupported = chainId && CONTRACT_ADDRESSES[chainId as ValidChainType];

  // Get contract addresses safely
  const contractAddresses = isChainSupported ? CONTRACT_ADDRESSES[chainId as ValidChainType] : null;

  // Debug contract addresses
  useEffect(() => {
    if (contractAddresses) {
      console.log("=== Contract Addresses ===");
      console.log("DEFAULT_ASSET_ADDRESS_ERC20:", contractAddresses.DEFAULT_ASSET_ADDRESS_ERC20);
      console.log("USER_FACTORY:", contractAddresses.USER_FACTORY);
      console.log("========================");
    }
  }, [contractAddresses]);

  const { data: approvedAmount, error: approvedAmountError, isLoading: approvedAmountLoading } = useReadContract({
    abi: erc20Abi,
    address: contractAddresses?.DEFAULT_ASSET_ADDRESS_ERC20 as `0x${string}`,
    functionName: "allowance",
    args: [address ?? NULL_ADDRESS, contractAddresses?.USER_FACTORY as `0x${string}`],
    query: {
      enabled: !!contractAddresses && !!address && isConnected && !!contractAddresses.DEFAULT_ASSET_ADDRESS_ERC20 && !!contractAddresses.USER_FACTORY
    }
  });

  // Debug approved amount
  useEffect(() => {
    console.log("=== Approved Amount Debug ===");
    console.log("Approved Amount:", approvedAmount);
    console.log("Error:", approvedAmountError);
    console.log("Loading:", approvedAmountLoading);
    console.log("============================");
  }, [approvedAmount, approvedAmountError, approvedAmountLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (createUser: boolean) => {
    console.log("=== handleSubmit Debug ===");
    console.log("Create User:", createUser);
    console.log("Form Data:", formData);
    console.log("Address:", address);
    console.log("Chain ID:", chainId);

    setIsLoading(true);
    try {
      if (!address) {
        const error = "No address found - wallet not connected";
        console.error(error);
        toast.error(error);
        return;
      }

      if (!isConnected) {
        const error = "Wallet not connected";
        console.error(error);
        toast.error(error);
        return;
      }

      const currentChainId = getChainId(config);
      console.log("Current Chain ID from config:", currentChainId);

      // Validate chain support
      if (!CONTRACT_ADDRESSES[currentChainId as ValidChainType]) {
        const error = `Chain ID ${currentChainId} is not supported. Supported chains: ${Object.keys(CONTRACT_ADDRESSES).join(", ")}`;
        console.error(error);
        toast.error(error);
        return;
      }

      const addresses = CONTRACT_ADDRESSES[currentChainId as ValidChainType];
      console.log("Using addresses:", addresses);

      if (!createUser) {
        console.log("Creating user without bond...");

        if (!addresses.USER_FACTORY || addresses.USER_FACTORY === "0x" || addresses.USER_FACTORY.length !== 42) {
          const error = `Invalid USER_FACTORY address: ${addresses.USER_FACTORY}`;
          console.error(error);
          toast.error(error);
          return;
        }

        const hash = await writeContract(config, {
          abi: USER_FACTORY_ABI,
          address: addresses.USER_FACTORY,
          functionName: "createUser",
          args: [address],
        });

        console.log("Create user transaction hash:", hash);
        await waitForTransactionReceipt(config, { hash });
        showTransactionToast(hash, currentChainId as ValidChainType);
        return;
      }

      // Validate form data for bond creation
      if (!formData.user2.trim()) {
        const error = "Please enter a counterparty address";
        console.error(error);
        toast.error(error);
        return;
      }

      if (!formData.amount.trim()) {
        const error = "Please enter an amount";
        console.error(error);
        toast.error(error);
        return;
      }

      let finalAddress = formData.user2.trim();
      console.log("Processing address:", finalAddress);

      if (!isAddress(finalAddress)) {
        console.log("Not a valid address, trying ENS resolution...");
        try {
          const client = createPublicClient({
            chain: mainnet,
            transport: http(),
          });
          const returnEns = await getEnsAddress(client, {
            name: normalize(finalAddress),
          });

          if (!returnEns) {
            const error = "Invalid ENS name or address";
            console.error(error);
            toast.error(error);
            return;
          }
          finalAddress = returnEns;
          console.log("ENS resolved to:", finalAddress);
        } catch (ensError) {
          console.error("ENS resolution error:", ensError);
          toast.error("Failed to resolve ENS name");
          return;
        }
      }

      const inputAmountParsed = parseFloat(formData.amount);
      console.log("Parsed amount:", inputAmountParsed);

      if (isNaN(inputAmountParsed) || inputAmountParsed <= 0) {
        const error = "Invalid amount. Please enter a valid number greater than 0.";
        console.error(error);
        toast.error(error);
        return;
      }

      // Safely handle approvedAmount
      const approvedAmountFormatted = approvedAmount
        ? Number(formatUnits(approvedAmount, 6))
        : 0;

      console.log("Approved amount formatted:", approvedAmountFormatted);

      // Convert to BigInt safely
      let amountInWei: bigint;
      try {
        amountInWei = parseUnits(inputAmountParsed.toString(), 6);
        console.log("Amount in wei:", amountInWei.toString());
      } catch (parseError) {
        console.error("Failed to parse amount to wei:", parseError);
        toast.error("Failed to parse amount");
        return;
      }

      // Validate contract addresses before using them
      if (!addresses.DEFAULT_ASSET_ADDRESS_ERC20 || addresses.DEFAULT_ASSET_ADDRESS_ERC20 === "0x" || addresses.DEFAULT_ASSET_ADDRESS_ERC20.length !== 42) {
        const error = `Invalid DEFAULT_ASSET_ADDRESS_ERC20: ${addresses.DEFAULT_ASSET_ADDRESS_ERC20}`;
        console.error(error);
        toast.error(error);
        return;
      }

      if (!addresses.USER_FACTORY || addresses.USER_FACTORY === "0x" || addresses.USER_FACTORY.length !== 42) {
        const error = `Invalid USER_FACTORY address: ${addresses.USER_FACTORY}`;
        console.error(error);
        toast.error(error);
        return;
      }

      console.log("Approving tokens...");
      const approvalHash = await writeContract(config, {
        abi: erc20Abi,
        address: addresses.DEFAULT_ASSET_ADDRESS_ERC20 as `0x${string}`,
        functionName: "approve",
        args: [addresses.USER_FACTORY, amountInWei],
      });

      console.log("Approval transaction hash:", approvalHash);
      await waitForTransactionReceipt(config, { hash: approvalHash });

      console.log("Creating bond with:", {
        user1: address,
        user2: finalAddress,
        amount: amountInWei.toString()
      });

      const hash = await createBond(
        address,
        finalAddress as `0x${string}`,
        amountInWei
      );

      console.log("Bond creation transaction hash:", hash);
      await waitForTransactionReceipt(config, { hash });
      showTransactionToast(hash, currentChainId as ValidChainType);

    } catch (error) {
      console.error("=== Error in handleSubmit ===");
      console.error("Error object:", error);
      console.error("Error message:", (error as Error)?.message);
      console.error("Error stack:", (error as Error)?.stack);
      console.error("===========================");

      const errorMessage = (error as Error)?.message || "An unknown error occurred";
      toast.error(`Transaction failed: ${errorMessage}`);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  // Show connection required
  if (!isConnected || !address) {
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-lg p-8 rounded-2xl backdrop-blur-xl bg-white/90 border border-white/20 shadow-2xl mx-4"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            exit={{ y: -20 }}
          >
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-orange-600">
                Wallet Not Connected
              </h2>
              <p className="text-muted-foreground">
                Please connect your wallet to continue.
              </p>
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Show error if chain is not supported
  if (!isChainSupported) {
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-lg p-8 rounded-2xl backdrop-blur-xl bg-white/90 border border-white/20 shadow-2xl mx-4"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            exit={{ y: -20 }}
          >
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-red-600">
                Unsupported Chain
              </h2>
              <p className="text-muted-foreground">
                Chain ID {chainId} is not supported. Please switch to Sepolia (11155111) or Base (8453).
              </p>
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-lg p-8 rounded-2xl backdrop-blur-xl bg-white/90 border border-white/20 shadow-2xl mx-4"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            exit={{ y: -20 }}
          >
            <div className="space-y-8">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold bg-clip-text text-primary">
                  Join Trust Protocol
                </h2>
                <p className="text-muted-foreground">
                  Secure your reputation with on-chain bonds
                </p>
                <p className="text-xs text-muted-foreground">
                  Chain: {chainId} | Address: {address?.slice(0, 6)}...{address?.slice(-4)}
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Counterparty Address
                      <span className="text-muted-foreground ml-1">(ENS supported)</span>
                    </label>
                    <div className="relative">
                      <Input
                        name="user2"
                        placeholder="vitalik.eth or 0x..."
                        value={formData.user2}
                        onChange={handleInputChange}
                        className="pl-10 pr-4 py-5 text-base bg-background/95 hover:bg-background transition-colors"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <Ethereum className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-foreground">
                      Bond Amount
                      <span className="text-muted-foreground ml-1">(USDC)</span>
                    </label>
                    <div className="relative">
                      <Input
                        name="amount"
                        type="number"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={handleInputChange}
                        className="pl-10 pr-4 py-5 text-base bg-background/95 hover:bg-background transition-colors"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <DollarSign className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => handleSubmit(true)}
                      className="w-full h-14 text-lg font-semibold bg-primary hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          Create Bond
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </Button>
                  </motion.div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-muted" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="px-2 bg-background text-muted-foreground">
                        Or continue without
                      </span>
                    </div>
                  </div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={() => handleSubmit(false)}
                      variant="outline"
                      className="w-full h-14 text-lg font-medium text-foreground hover:bg-muted/50"
                      disabled={isLoading}
                    >
                      Skip Bond Creation
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <BondLoadingModal />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
