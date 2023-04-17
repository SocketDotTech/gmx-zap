import { ARBITRUM, AVALANCHE } from "./chains";

export const CONTRACTS: {
  [x: number]: {
    [y: string]: string;
  };
} = {
  [ARBITRUM]: {
    Reader: "0x2b43c90D1B727cEe1Df34925bcd5Ace52Ec37694",
    GlpManager: "0x3963FfC9dff443c2A94f21b129D429891E32ec18",
    RewardRouter: "0xA906F338CB21815cBc4Bc87ace9e68c87eF8d8F1",
    GlpRewardRouter: "0xB95DB5B167D75e6d04227CfFFA61069348d271F5",
    RewardReader: "0x8BFb8e82Ee4569aee78D03235ff465Bd436D40E0",
    GLP: "0x4277f8F2c384827B5273592FF7CeBd9f2C1ac258",
    FeeGlpTracker: "0x4e971a87900b931fF39d1Aad67697F49835400b6",
    StakedGlpTracker: "0x1aDDD80E6039594eE970E5872D247bf0414C8903",
    USDG: "0x45096e7aA921f27590f8F19e457794EB09678141",
    SocketGlpWrapper: "0xddC3A2bc1D6252D09A82814269d602D84Ca3E7ae",
    Vault: "0x489ee077994B6658eAfA855C308275EAd8097C4A",
  },
  [AVALANCHE]: {
    Reader: "0x2eFEE1950ededC65De687b40Fd30a7B5f4544aBd",
    GlpManager: "0xD152c7F25db7F4B95b7658323c5F33d176818EE4",
    RewardRouter: "0x82147C5A7E850eA4E28155DF107F2590fD4ba327",
    GlpRewardRouter: "0xB70B91CE0771d3f4c81D87660f71Da31d48eB3B3",
    RewardReader: "0x04Fc11Bd28763872d143637a7c768bD96E44c1b6",
    GLP: "0x01234181085565ed162a948b6a5e88758CD7c7b8",
    FeeGlpTracker: "0xd2D1162512F927a7e282Ef43a362659E4F2a728F",
    StakedGlpTracker: "0x9e295B5B976a184B14aD8cd72413aD846C299660",
    USDG: "0xc0253c3cC6aa5Ab407b5795a04c28fB063273894",
    SocketGlpWrapper: "0x0675830e12683eBDf0cA4A48dC8708E8e123feE5",
    Vault: "0x9ab2De34A33fB459b538c43f251eB825645e8595",
  },
};
