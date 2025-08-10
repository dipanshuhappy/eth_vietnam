// hooks/useBonding.ts

import { useQuery, useMutation } from '@tanstack/react-query';
import { readContract, writeContract } from 'wagmi/actions';

import { REGISTRY_ABI } from '@/abi/registry';

import { USER_FACTORY_ABI } from '@/abi/user-factory';
import { USER_ABI } from '@/abi/user';
import { config } from '@/lib/wagmi-config';
import { CONTRACT_ADDRESSES, NULL_ADDRESS } from '@/lib/constants';
import { createBond, getApprovalAddressForCreateBonds, getUserDetails, getUserWalletFromRegistry, User } from '@/lib/calls';
import { useChainId } from 'wagmi';

export const useProtocolChainId = () => {
  const chainId = useChainId();
  return (chainId ?? 11155111) as keyof typeof CONTRACT_ADDRESSES;
}
export const useResolveUserWallet = (userWallet: `0x${string}`) => {
  
  return useQuery<`0x${string}`>({
    queryKey: ['resolveUserWallet', userWallet],
    queryFn: async () => {
      const address = await readContract(config, {
        abi: USER_ABI,
        functionName: 'owner',
        address: userWallet,
      });
      return address as `0x${string}`;
    },
    enabled: Boolean(userWallet),

 })
}
/**
 * Hook to fetch the user wallet address from the registry.
 *
 * @param user - The user address (as a 0x-prefixed string)
 * @returns A query object containing the user wallet address.
 */
export const useUserWalletFromRegistry = (user: `0x${string}`) => {
  const chainId = useProtocolChainId();
  console.log("chainId",chainId)
  return useQuery<`0x${string}`>({
    queryKey: ['userWallet', user],
    queryFn: async () => {
      
      const address = await getUserWalletFromRegistry(user); 
      return address as `0x${string}`;
    },
    // Only run the query if a valid user address is provided.
    enabled: Boolean(user),
  });
};

/**
 * Hook to fetch the approval address for creating bonds.
 *
 * This hook internally fetches both users’ wallets. If user1’s wallet is not set (equals NULL_ADDRESS)
 * then it returns the user factory contract address; otherwise, it returns user1’s wallet.
 *
 * @param user1 - The first user address.
 * @param user2 - The second user address.
 * @returns A query object containing the approval address.
 */
export const useApprovalAddressForCreateBonds = (user1: `0x${string}`, user2: `0x${string}`) => {
  return useQuery<`0x${string}`>({
    queryKey: ['approvalAddressForCreateBonds', user1, user2],
    queryFn: async () => {
      // Fetch both user wallet addresses concurrently.a
      const address = await getApprovalAddressForCreateBonds(user1, user2);
      return address;
    },
    enabled: Boolean(user1 && user2),
  });
};

/**
 * Hook to perform the create bond operation.
 *
 * This mutation hook first reads the user wallets from the registry. If user1’s wallet
 * is not set (NULL_ADDRESS), it calls the user factory’s `createUserWithBond` function;
 * otherwise, it calls the user contract’s `createBond` function.
 *
 * @returns A mutation object that you can use to trigger the bond creation.
 */
export const useCreateBond = () => {
  return useMutation<
    // Return type of the mutation (transaction hash)
    `0x${string}`,
    // Error type
    Error,
    // Variables passed into the mutation function
    { user1: `0x${string}`; user2: `0x${string}`; initialAmount: bigint }
  >({
    mutationFn: async ({ user1, user2, initialAmount }) => {
      const hash = await createBond(user1, user2, initialAmount);

      if (!hash) {
        throw new Error('User type is not resolved');
      }
      return hash as `0x${string}`;
    },
  });
};


export const useUserDetails = (user: `0x${string}`) => {
  return useQuery<User>({
    queryKey: ['userDetails', user],
    queryFn: async () => {
      const userDetails = await getUserDetails(user); 
      return userDetails;
    },
    enabled: Boolean(user),
  });
}