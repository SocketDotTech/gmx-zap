import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { getRpcUrl } from "../../config";
import { JsonRpcProvider } from "@ethersproject/providers";

export const useJsonRpcProvider = (chainId: number) => {
	const [provider, setProvider] = useState<JsonRpcProvider>();

	useEffect(() => {
		async function initializeProvider() {
			const rpcUrl = getRpcUrl(chainId);

			if (!rpcUrl) return;

			const provider = new ethers.providers.JsonRpcProvider(rpcUrl);

			await provider.ready;

			setProvider(provider);
		}

		initializeProvider();
	}, [chainId]);

	return { provider };
};
