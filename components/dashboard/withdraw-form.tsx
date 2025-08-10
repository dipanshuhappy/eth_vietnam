"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BondLoadingModal } from "@/components/bond-loading-modal";
import Image from "next/image";
import { toast } from "sonner";
import { showTransactionToast } from "../showTransactionToast";
import { useAccount, useChainId, useReadContract } from "wagmi";
import { erc20Abi, formatUnits, parseUnits } from "viem";
import {
CONTRACT_ADDRESSES,
  NULL_ADDRESS,
  ValidChainType,
} from "@/lib/constants";
import {
  getEnsAddress,
  waitForTransactionReceipt,
  writeContract,
} from "wagmi/actions";
import { config } from "@/lib/wagmi-config";
import { USER_FACTORY_ABI } from "@/abi/user-factory";
import { createBond } from "@/lib/calls";
import { isAddress } from "viem";
import { USER_ABI } from "@/abi/user";
import { useUserWalletFromRegistry } from "@/hooks/use-protocol";
import { X } from "lucide-react";

export interface WithdrawBondFormProps {
  onClose : () => void 
  bondAddress: string
  onSuccess?: () => void
}


export function WithdrawBondForm({bondAddress, onClose, onSuccess}:WithdrawBondFormProps ) {
  const { address } = useAccount();
  const chainId = useChainId();

  const [formData, setFormData] = useState<{
    user2: string;
    amount: string;
  }>({
    user2: bondAddress,
    amount: "",
  });

  const {data:userWallet} = useUserWalletFromRegistry(address ?? NULL_ADDRESS)


 

  const [isLoading, setIsLoading] = useState(false);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (createUser: boolean) => {
    setIsLoading(true);
    try {
      let finalAddress =  bondAddress;
      if (!address) {
        toast.error("No address found");
        throw new Error("No address found");
      }
      if(!userWallet){
        toast.error("No wallet found")
        throw new Error("No wallet found")
      }
      
     
     
      const hash = await writeContract(
        config,{
            abi:USER_ABI,
            address:userWallet,
            functionName:'withdraw',
            args:[finalAddress as `0x${string}`]
        }
      ) 
      await waitForTransactionReceipt(config, {
        hash: hash,
      });
      showTransactionToast(hash, chainId as ValidChainType);
      onSuccess?.();
    } catch (error) {
      toast.error((error as Error).message);
      console.error(error);
    }
    finally {
      setIsLoading(false);
    }
    
  };

  return (
    <>
      <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full max-w-md p-8 rounded-xl bg-gradient-to-br from-[#cdffd8] to-blue-300"
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-blue-900 hover:text-blue-700"
      >
        <X className="h-6 w-6" />
      </button>

        <h2 className="text-3xl font-bold mb-6 text-center text-blue-900">
          Are you sure to withdraw ?
        </h2>
        <div className="space-y-6">
          <div>
           
          </div>
          
          <div className="flex space-x-4">
            <Button
              onClick={() => handleSubmit(true)}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >            
              Confirm
            </Button>
          </div>
        </div>
      </motion.div>
      <AnimatePresence>{isLoading && <BondLoadingModal />}</AnimatePresence>
    </>
  );
}
