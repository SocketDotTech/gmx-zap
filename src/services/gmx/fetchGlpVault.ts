import { ethers } from "ethers";
import { abis, CONTRACTS, getRpcUrl } from "../../config";

const getGlpVault = async ({
  chainId,
  tokenAddress,
  tokenAmount,
  tokenPrice,
}: {
  chainId: number;
  tokenAddress: string;
  tokenAmount: number;
  tokenPrice: any;
}) => {
  const rpcUrl = getRpcUrl(chainId);
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  const glpVaultContract = new ethers.Contract(
    CONTRACTS[chainId]["Vault"],
    abis.vaultAbi,
    provider
  );

  const USDC_DECIMAL_MUL = 1000000;
  const multipliedAmount = tokenAmount * tokenPrice * USDC_DECIMAL_MUL;

  const fee = await glpVaultContract.getFeeBasisPoints(
    tokenAddress,
    multipliedAmount,
    25,
    60,
    true
  );
  return fee?.toNumber() / 100;
};

export default getGlpVault;
