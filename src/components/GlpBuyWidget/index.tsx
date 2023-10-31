import { BigNumber, ethers } from "ethers";
import { Interface } from "ethers/lib/utils.js";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useAccount, useNetwork, } from "wagmi";
import {
  abis,
  BASIS_DIVISOR_FOR_SLIPPAGE,
  CONTRACTS,
  GAS_LIMIT_FOR_BUYING_GLP,
  GLP_DECIMALS,
  NATIVE_TOKEN_ADDRESS,
  USD_DECIMALS,
  ZERO_BIG_NUMBER,
} from "../../config";
import {
  bigNumberify,
  expandDecimals,
  formatAmount,
  limitDecimals,
  parseValue,
} from "../../helpers";
import { useAppDispatch, useAppSelector } from "../../hooks";
import {
  setInputChainNativeToken,
  setRefuelDetail,
  setRefuelFromAmount,
  setRefuelToAmount,
  setRoute,
} from "../../redux";
import {
  getGlpVault,
  getQuote,
  getTokenBalanceByTokenAddress,
  getTokenPriceByTokenAddress,
} from "../../services";
import { BridgeTokens } from "../BridgeToken";
import { ChainsSelect } from "../ChainSelect";
import { TokensDetail } from "../TokenDetail";
import { WidgetHeader } from "../WidgetHeader";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { TxnHistory } from "../TxnHistory";
import { SwitchNetworkButton } from "../Button";

let quoteListResponse: any;

export const GlpBuyWidget = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const dispatch = useAppDispatch();
  const {
    inputToken,
    inputTokenAmount,
    outputToken,
    inputTokenBalance,
    inputChainNativeTokenPrice,
  } = useAppSelector((state) => state.tokens);
  const { glpPrice } = useAppSelector((state) => state.glp);
  const { inputChainId, outputChainId, chainsInfo } = useAppSelector(
    (state) => state.chains
  );
  const { route, slippage } = useAppSelector((state) => state.route);
  const { enabledRefuel } = useAppSelector((state) => state.refuel);

  const [proceedBtnDisabled, setProceedBtnDisabled] = useState<boolean>(true);
  const [proceedBtnText, setProceedBtnText] = useState<string>("Proceed");
  const [minGlpReceived, setMinGlpReceived] = useState<string>("");
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [minGlpAmount, setMinGlpAmount] = useState<BigNumber>(ZERO_BIG_NUMBER!);
  const [finalRoute, setFinalRoute] = useState<any>({});
  const [finalRefuel, setFinalRefuel] = useState<any>({});
  const [destinationCallData, setDestinationCallData] = useState<any>({});

  useQuery(
    ["inputChainNativeToken", inputChainId, address],
    () =>
      getTokenBalanceByTokenAddress({
        chainId: inputChainId.toString(),
        tokenAddress: NATIVE_TOKEN_ADDRESS,
        userAddress: address!,
      }),
    {
      onSuccess: (data: any) => {
        const response = data?.data?.result;
        dispatch(setInputChainNativeToken(response));
      },
      enabled: !!(inputToken.chainId !== 0 && address != undefined),
      refetchOnWindowFocus: false,
      refetchOnMount:false,
      refetchOnReconnect:false,
      refetchInterval: 5000,
      refetchIntervalInBackground: true,
      notifyOnChangeProps: ["data"],
    }
  );

  quoteListResponse = useQuery(
    [
      "quoteList",
      inputToken.address,
      outputToken.address,
      inputTokenAmount,
      enabledRefuel,
    ],
    () => {
      return getQuote({
        fromChainId: inputChainId.toString(),
        fromTokenAddress: inputToken.address,
        toChainId: outputChainId.toString(),
        toTokenAddress: outputToken.address,
        fromAmount: parseValue(
          inputTokenAmount,
          inputToken.decimals
        )?.toString()!,
        userAddress: address!,
        uniqueRoutesPerBridge: true,
        sort: "output",
        bridgeWithGas: enabledRefuel,
        includeBridges: ["stargate"],
        singleTxOnly: true,
        recipient: CONTRACTS[outputChainId]["SocketGlpWrapper"],
      });
    },
    {
      enabled: !!(
        address &&
        inputToken.address &&
        outputToken.address &&
        inputTokenAmount != ""
      ),
      cacheTime: 0,
      refetchInterval: 30000,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (!address) {
      setProceedBtnText("Connect Wallet");
      setProceedBtnDisabled(true);
    } else if ((parseFloat(inputTokenAmount) || 0) == 0) {
      setProceedBtnText("Enter Input Token Amount");
      setProceedBtnDisabled(true);
    } else if (quoteListResponse.isLoading) {
      setProceedBtnText("Fetching Route...");
      setProceedBtnDisabled(true);
    } else if (quoteListResponse.isSuccess && Object.keys(route).length === 0) {
      setProceedBtnText("No Routes Available");
      setProceedBtnDisabled(true);
    } else if ((parseFloat(inputTokenAmount) || 0) > (inputTokenBalance || 0)) {
      setProceedBtnText("Not Enough Balance");
      setProceedBtnDisabled(true);
    } else if (chain?.id !== inputChainId) {
      setProceedBtnText(`Switch Network`);
      setProceedBtnDisabled(true);
    } else if (quoteListResponse.isSuccess && Object.keys(route).length !== 0) {
      setProceedBtnText("Proceed");
      setProceedBtnDisabled(false);
    } else {
      setProceedBtnText("loading...");
      setProceedBtnDisabled(true);
    }
  }, [
    address,
    inputTokenAmount,
    quoteListResponse.isLoading,
    inputTokenBalance,
    quoteListResponse.isSuccess,
    route,
    chain,
  ]);

  useEffect(() => {
    console.log(',,rrr,')
    if (!quoteListResponse.isSuccess) return;
    if (inputTokenAmount === "") {
      dispatch(setRoute({}));
      return;
    }

    const result: any = quoteListResponse?.data?.data.result;
    let route = {};
    if (result?.routes?.length > 0) {
      route = result?.routes[0];
      dispatch(setRoute(route));
    } else if (result?.routes?.length === 0) {
      dispatch(setRoute([]));
    }

    if (result?.refuel) {
      dispatch(setRefuelDetail(result?.refuel));
      dispatch(setRefuelFromAmount(result?.refuel?.fromAmount));
      dispatch(setRefuelToAmount(result?.refuel?.toAmount));
    }
  }, [
    quoteListResponse.isSuccess,
    quoteListResponse.isFetching,
    inputTokenAmount,
  ]);

  const proceedToFinal = async () => {
    if (!address) return;
    setProceedBtnText("loading...");
    setProceedBtnDisabled(true);

    // const contract = new ethers.Contract(
    // 	CONTRACTS[outputChainId]["SocketGlpWrapper"],
    // 	abis.rewardRouterAbi,
    // 	signer!
    // );
    const method = "buyGlp";
    const params = [address, outputToken.address, 0, minGlpAmount];
    const value = 0;

    const iFace = new Interface(abis.socketGlpWrapperAbi);
    const destinationPayload = iFace.encodeFunctionData(method, params);

    // const gasLimit = await getGasLimit(contract, method, params, value);
    const gasLimit = bigNumberify(GAS_LIMIT_FOR_BUYING_GLP)!;
    const destinationGasLimit = gasLimit.toNumber() + 30000;

    const finalRoute: any = await getQuote({
      fromChainId: inputChainId.toString(),
      fromTokenAddress: inputToken.address,
      toChainId: outputChainId.toString(),
      toTokenAddress: outputToken.address,
      fromAmount: parseValue(
        inputTokenAmount,
        inputToken.decimals
      )?.toString()!,
      userAddress: address,
      uniqueRoutesPerBridge: true,
      sort: "output",
      includeBridges: ["stargate"],
      bridgeWithGas: enabledRefuel,
      singleTxOnly: true,
      recipient: CONTRACTS[outputChainId]["SocketGlpWrapper"],
      destinationPayload: destinationPayload,
      destinationGasLimit: destinationGasLimit.toString(),
    });

    if (finalRoute.data?.result?.routes.length > 0) {
      const FINAL_ROUTE = finalRoute.data?.result?.routes[0];
      const DESTINATION_CALLDATA = finalRoute.data?.result?.destinationCallData;
      if (enabledRefuel) {
        const FINAL_REFUEL = finalRoute.data?.result?.refuel;
        if (FINAL_REFUEL) setFinalRefuel(FINAL_REFUEL);
      }
      setDestinationCallData(DESTINATION_CALLDATA);
      setFinalRoute(FINAL_ROUTE);
      setTabIndex(1);
      setProceedBtnText("Proceed");
      setProceedBtnDisabled(false);
    } else {
      setProceedBtnText("No Routes Available");
      setProceedBtnDisabled(true);
    }
  };

  const userTxs = route?.userTxs;
  const fundMovrTx = userTxs?.filter(
    (tx: any) => tx.userTxType === "fund-movr"
  )?.[0];
  const bridgeStep = fundMovrTx?.steps?.filter(
    (step: any) => step.type === "bridge"
  )?.[0];
  const destTokenAddress = bridgeStep?.toAsset?.address;

  // let price;
  const { data } = useQuery(
    ["postBridgeTokenPrice"],
    () =>
      getTokenPriceByTokenAddress({
        chainId: bridgeStep.toChainId,
        tokenAddress: destTokenAddress,
      }),
    {
      enabled: !!bridgeStep?.toAsset?.address,
      refetchInterval: 40000,
      notifyOnChangeProps: ["data"],
    }
  );

  const { data: fee } = useQuery(
    ["glpFees", data, bridgeStep],
    () => {
      //@ts-ignore
      const tokenPrice = data?.data?.result?.tokenPrice;
      const tokenAddress = bridgeStep?.toAsset?.address;
      return getGlpVault({
        chainId: bridgeStep?.toChainId,
        tokenAddress: tokenAddress,
        tokenAmount: bridgeStep?.toAmount,
        tokenPrice: tokenPrice,
      });
    },
    {
      enabled: !!(
        // @ts-ignore
        (data?.data?.result?.tokenPrice && bridgeStep?.toAsset?.address)
      ),
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchInterval: 10000,
      notifyOnChangeProps: ["data"],
    }
  );

  useEffect(() => {
    if (Object.keys(route).length === 0) {
      if (minGlpReceived !== "") setMinGlpReceived("");
    } else if (fee) {
      const glpPriceInUSD = formatAmount(glpPrice, USD_DECIMALS, 10, false);
      console.log({rr: route.receivedValueInUsd});
      const minGlpAmountWithoutDeduction =
        (route.outputValueInUsd ) /
        parseFloat(glpPriceInUSD);

      // Deducting amount as per glp fee
      let minGlpAmount = (
        minGlpAmountWithoutDeduction -
        (minGlpAmountWithoutDeduction * fee) / 100
      )?.toString();

      setMinGlpReceived(minGlpAmount);
      minGlpAmount = limitDecimals(minGlpAmount, 5);

      minGlpAmount = bigNumberify((parseFloat(minGlpAmount) * 1e5).toFixed(0))
        ?.mul(BASIS_DIVISOR_FOR_SLIPPAGE - slippage * 1000)
        .div(BASIS_DIVISOR_FOR_SLIPPAGE)
        .toString()!;

      setMinGlpAmount(expandDecimals(minGlpAmount, 13));
    }
  }, [route, slippage, fee]);

  return (
    <>
      {/* GLP Bridge Widget */}
      <div className="max-w-[30rem] w-full bg-[#17192E] rounded border border-[#23263b] max-[900px]:min-w-full p-3">
        {tabIndex === 0 && (
          <>
            <div className="pb-3">
              <WidgetHeader setTabIndex={setTabIndex} />
            </div>
            <div className="pb-3">
              <ChainsSelect />
            </div>
            <div>
              <TokensDetail glpReceived={minGlpReceived} />
            </div>

            {/* <div className="pb-3"></div>
						<RefuelBox /> */}

            <div className="pb-3"></div>
            {quoteListResponse.isFetching && (
              <>
                <div className="text-sm font-medium text-white">
                  <div className="flex justify-between">
                    <div className="grow mr-2">Fetching Route...</div>
                    <img
                      src="assets/loading.svg"
                      className="inline animate-spin mr-2 h-3 w-3 text-white"
                    />{" "}
                  </div>
                </div>
                <div className="pb-1"></div>
              </>
            )}
            {quoteListResponse.isSuccess && Object.keys(route).length !== 0 && (
              <>
                <div className="px-3 py-3.5 bg-[#2F3043] rounded-lg">
                  <div className="flex justify-between">
                    <div className="grow text-sm text-zinc-400 font-medium mr-2">
                      Estimated Time
                    </div>
                    <div className="text-sm text-white font-medium text-right">
                      {route.serviceTime / 60} min
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="grow text-sm text-zinc-400 font-medium mr-2">
                      Source Gas Fee
                    </div>
                    <div className="text-sm text-white font-medium text-right">
                      ~{" "}
                      {(
                        route.totalGasFeesInUsd.toFixed(2) /
                        inputChainNativeTokenPrice
                      )
                        .toFixed(3)
                        .toString()}{" "}
                      {chainsInfo[inputChainId].currency.symbol} ($
                      {route.totalGasFeesInUsd.toFixed(2).toString()})
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="grow text-sm text-zinc-400 font-medium mr-2">
                      Bridge Fees
                    </div>
                    <div className="text-sm text-white font-medium text-right capitalize">
                      {formatAmount(
                        bridgeStep?.protocolFees?.amount,
                        bridgeStep?.protocolFees?.asset?.decimals
                      )}{" "}
                      {bridgeStep?.protocolFees?.asset?.symbol} ($
                      {bridgeStep?.protocolFees?.feesInUsd?.toFixed(3)})
                    </div>
                  </div>
                  {/* <div className="flex justify-between">
											<div className="grow text-sm text-zinc-400 font-medium mr-2">
												Dest. Token Amount
											</div>
											<div className="text-sm text-white font-medium text-right">
												{(
													parseInt(route.toAmount) /
													10 ** outputToken.decimals
												).toString()}{" "}
												{outputToken.symbol}
											</div>
										</div> */}
                  <div className="flex justify-between">
                    <div className="grow text-sm text-zinc-400 font-medium mr-2">
                      Min GLP Received
                    </div>
                    <div className="text-sm text-white font-medium text-right">
                      {formatAmount(minGlpAmount, GLP_DECIMALS, 3, true)} GLP
                    </div>
                  </div>
                  {!!fee && (
                    <div className="flex justify-between">
                      <div className="grow text-sm text-zinc-400 font-medium mr-2">
                        GLP Fees
                      </div>
                      <div className="text-sm text-white font-medium text-right">
                        {fee}%
                      </div>
                    </div>
                  )}
                </div>
                <div className="pb-3"></div>
              </>
            )}
            <div className="flex justify-between">
              <div className="grow text-sm text-zinc-400 font-medium mr-2">
                <div className="flex flex-row">
                  Slippage
                  <img
                    id="slippage-glp-info"
                    src="assets/info.svg"
                    className="ml-1.5 w-4 h-4 cursor-pointer self-center"
                  />
                  <ReactTooltip
                    anchorId="slippage-glp-info"
                    place="top"
                    style={{ width: "200px" }}
                    content="Your buying GLP tx will revert and you'll receive USDC if the price changes unfavourably by more than this percentage."
                  />
                </div>
              </div>
              <div className="text-sm text-white font-medium text-right">
                {slippage}%
              </div>
            </div>

            <div className="pb-1"></div>
            {proceedBtnText === "Switch Network" &&
            chain!.id != inputChainId ? (
              <SwitchNetworkButton bgColor="#2E3FD9" />
            ) : (
              <button
                className={`p-3 relative text-white text-base font-semibold w-full rounded bg-[#2E3FD9] ${
                  proceedBtnDisabled
                    ? "cursor-not-allowed bg-[#5B5C68]"
                    : "cursor-pointer"
                }`}
                disabled={proceedBtnDisabled}
                onClick={proceedToFinal}
              >
                {proceedBtnText === "loading..." && (
                  <div className="absolute left-4 top-3.5 animate-spin w-4 h-4 rounded-full border-2 border-white border-b-[#ffffff50]" />
                )}
                {proceedBtnText}
              </button>
            )}
          </>
        )}
        {tabIndex === 1 && (
          <>
            <BridgeTokens
              setTabIndex={setTabIndex}
              route={finalRoute}
              refuel={finalRefuel}
              glpReceived={minGlpReceived}
              destinationCallData={destinationCallData}
            />
          </>
        )}
        {tabIndex === 2 && <TxnHistory setTabIndex={setTabIndex} />}
      </div>
    </>
  );
};
