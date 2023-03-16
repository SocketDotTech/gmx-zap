import { BigNumber, ethers } from "ethers";
import { bigNumberify } from "../helpers";

export const glpSupportedTokens: {
	[x: number]: string[];
} = {
	42161: ["WBTC", "LINK", "UNI", "USDC", "USDT", "DAI", "FRAX", "WETH"],
	43114: ["WETH.E", "WBTC.E", "BTC.B", "USDC", "USDC.E", "WAVAX"],
};

export const NATIVE_TOKEN_ADDRESS =
	"0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";

export const GLP_DECIMALS = 18;
export const USD_DECIMALS = 30;

export const BASIS_POINTS_DIVISOR = 10000;
export const BASIS_DIVISOR_FOR_SLIPPAGE = 100000;
export const DEFAULT_SLIPPAGE_AMOUNT = 30;
export const SECONDS_PER_YEAR = 31536000;

export const ZERO_BIG_NUMBER = bigNumberify(0)!;

export const defaultSlippageArray = [0.5, 1, 3];

export const PLACEHOLDER_ACCOUNT = ethers.Wallet.createRandom().address;

export const GAS_LIMIT_FOR_BUYING_GLP = "1930000";

export const INPUT_TOKEN_AMOUNT_FIELD_DEBOUNCE_TIMEOUT = 1500;

export const disclaimerProperty = "doNotShowDisclaimer";
