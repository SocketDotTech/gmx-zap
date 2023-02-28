import {
	mainnet,
	polygon,
	optimism,
	arbitrum,
	bsc,
	avalanche,
	fantom,
} from "@wagmi/chains";

const _Ethereum = {
	...mainnet,
	iconUrl: "https://movricons.s3.ap-south-1.amazonaws.com/Ether.svg",
};

const _Polygon = {
	...polygon,
	iconUrl: "https://movricons.s3.ap-south-1.amazonaws.com/Matic.svg",
};

const _Optimism = {
	...optimism,
	iconUrl: "https://movricons.s3.ap-south-1.amazonaws.com/Optimism.svg",
};

const _Arbitrum = {
	...arbitrum,
	name: "Arbitrum",
	iconUrl: "https://movricons.s3.ap-south-1.amazonaws.com/Arbitrum.svg",
};

const _BSC = {
	...bsc,
	name: "BSC",
	iconUrl: "https://movricons.s3.ap-south-1.amazonaws.com/BSC.svg",
};

const _Avalanche = {
	...avalanche,
	iconUrl: "https://movricons.s3.ap-south-1.amazonaws.com/Avalanche.svg",
};

const _Fantom = {
	...fantom,
	iconUrl: "https://movricons.s3.ap-south-1.amazonaws.com/Fantom.svg",
};

export { _Ethereum, _Polygon, _Optimism, _Arbitrum, _BSC, _Avalanche, _Fantom };
