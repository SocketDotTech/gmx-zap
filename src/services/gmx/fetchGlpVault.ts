import { ethers } from "ethers";
import { abis, CONTRACTS, getRpcUrl } from "../../config";

const getGlpVault = async ({
  provider,
  chainId,
  tokenAddress,
  tokenAmount,
  tokenPrice,
}: {
  provider: any;
  chainId: number;
  tokenAddress: string;
  tokenAmount: number;
  tokenPrice: any;
}) => {
  const rpcUrl = getRpcUrl(chainId);
  const providerNew = new ethers.providers.JsonRpcProvider(rpcUrl);
  const glpVaultContract = new ethers.Contract(
    CONTRACTS[chainId]["Vault"],
    abis.vaultAbi,
    providerNew
  );

//   console.log(tokenAddress, tokenAmount, tokenPrice);
//   console.log(tokenAmount * tokenPrice);
  // const tokenMul = Math.floor(tokenAmount * tokenPrice);

//   const tokenAmountBN = ethers.BigNumber.from(tokenAmount);
//   const PRECISION = 1000000;
//   const mulAmount = tokenAmountBN.mul(tokenPrice * PRECISION).div(PRECISION);
//   console.log("mulAmount", mulAmount.toString());

// console.log(tokenAmount, tokenPrice);
const multipliedAmount = Math.floor(tokenAmount * tokenPrice);
// console.log('multiplied amount: ', multipliedAmount);
console.log('called');
  const fee = await glpVaultContract.getFeeBasisPoints(
    tokenAddress,
    multipliedAmount,
    25,
    60,
    true
  );
  console.log('fee', fee?.toString());
  return fee;
};

export default getGlpVault;
