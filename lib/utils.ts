import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {formatUnits} from "viem"
import { DEFAULT_DECIMALS } from "./constants";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function groupBy<T>(array: T[], groupSize: number): T[][] {
  if (groupSize <= 0) {
    throw new Error("groupSize must be a positive number.");
  }

  const result: T[][] = [];
  for (let i = 0; i < array.length; i += groupSize) {
    result.push(array.slice(i, i + groupSize));
  }
  return result;
}

export function formateDefaultAssetAmount(amount: bigint) {
  return formatUnits(amount, DEFAULT_DECIMALS);
}