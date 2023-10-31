import React, { useEffect, useRef, useState } from "react";
import { useClickAway } from "../../hooks";
import { useQuery } from "react-query";
import { getIfTokenSupported, getUserTokenBalances } from "../../services";
import { ethers } from "ethers";
import { queryResponseObj, TokenDetail } from "../../types";
import { useAccount } from "wagmi";
import { getUserBalanceOfChainId } from "../../helpers/DataHelper";

type Props = {
  options: Array<{
    chainId: number;
    name: string;
    icon: string;
    address: string;
    symbol: string;
    decimals: number;
  }>;
  chainId: number;
  setTokenDetail: ({ address, symbol, icon }: TokenDetail) => void;
  onHide: (value: boolean) => void;
};

export const InputTokenSelectDropdown = ({
  options,
  setTokenDetail,
  onHide,
  chainId,
}: Props) => {
  // options.sort((a, b) =>
  // 	a.symbol > b.symbol ? 1 : a.symbol < b.symbol ? -1 : 0
  // );

  const [moreOptions, setMoreOptions] = useState(options);
  const { address } = useAccount();
  const [filteredResults, setFilteredResults] = useState(moreOptions);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddress, setIsAddress] = useState(false);
  const [tokenBalance, setTokenBalance] = useState<{
    [x: string]: number;
  }>({});
  const clickAwayRef = useRef<HTMLDivElement>(null);

  //  Sorts the tokens as per balance
  useEffect(() => {
    if (tokenBalance) {
      const _tokenList = options;
      const tokensWithBalances = Object.keys(tokenBalance);

      const _sortedTokens = tokensWithBalances.map((address) => {
        return _tokenList.filter(
          (x) => x.address.toLowerCase() === address.toLowerCase()
        )?.[0];
      });

      const restTokens = options.filter((token) => {
        return !_sortedTokens.some(
          (x) => x?.address?.toLowerCase() === token?.address?.toLowerCase()
        );
      });

      const _allTokens = [..._sortedTokens, ...restTokens];
      setMoreOptions(_allTokens);
    }
  }, [tokenBalance]);

  useEffect(() => {
    setFilteredResults(moreOptions);
  }, [moreOptions]);

  useQuery(
    ["userTokenBalances", address],
    () =>
      getUserTokenBalances({
        userAddress: address!,
      }),
    {
      onSuccess: (data: any) => {
        const tokenBalance = getUserBalanceOfChainId(data, chainId);
        setTokenBalance(tokenBalance);
      },
      enabled: !!address,
      refetchInterval: 40000,
    }
  );

  let newToken: any = {};
  const tokenSupport: queryResponseObj = useQuery(
    ["tokenSupport", isAddress],
    () =>
      getIfTokenSupported({
        chainId: chainId.toString(),
        tokenAddress: searchQuery,
      }),
    {
      enabled: !!isAddress,
      refetchInterval: 40000,
    }
  );

  if (tokenSupport.isSuccess) {
    if (tokenSupport.data?.data?.result.isSupported) {
      newToken = tokenSupport.data?.data?.result.token;
    }
  }

  const handleSearch = (searchQuery: string) => {
    const result: any = [];
    moreOptions.map((option) => {
      if (
        option.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.address.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        result.push(option);
      }
    });
    setFilteredResults(result);

    if (result.length === 0) {
      if (ethers.utils.isAddress(searchQuery)) {
        setIsAddress(true);
      }
    }
  };

  const addNewToken = () => {
    const tokenDetail = newToken;
    newToken = {};
    let cust: any = localStorage.getItem("customTokens");
    if (cust) {
      cust = JSON.parse(cust);
    } else {
      cust = {};
    }
    if (!cust[address!]) cust[address!] = {};
    if (!cust[address!][chainId]) cust[address!][chainId] = [];
    cust[address!][chainId].push(tokenDetail);
    localStorage.setItem("customTokens", JSON.stringify(cust));
    setMoreOptions([tokenDetail, ...moreOptions]);
  };

  useClickAway(clickAwayRef, () => onHide(true));

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-50 p-5">
      <div
        ref={clickAwayRef}
        className="text-white bg-[#141529] py-2 rounded z-10 w-full sm:w-[400px] border-2 border-[#23263b]"
      >
        <div className="flex m-1 flex-col">
          <div className="w-full p-2.5">
            <input
              className="rounded-lg bg-[#17192E] p-2 w-full outline-none border-none"
              placeholder="Search Name or Address"
              onChange={(e) => {
                if (isAddress) setIsAddress(false);
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              value={searchQuery}
              autoFocus
            />
          </div>
          <div className="flex flex-row my-2 text-xs text-textColorSecondary mx-2">
            <div className="grow ml-1">Token Name</div>
            <div className="mr-3">Balance</div>
          </div>
          <div style={{ height: "310px", overflowY: "scroll" }}>
            {filteredResults.map((option) => {
              return (
                <div
                  className="flex mx-2 my-2 p-1.5 rounded items-center text-sm font-medium hover:cursor-pointer hover:bg-[#2F3043]"
                  onClick={() => {
                    setTokenDetail({
                      address: option.address,
                      symbol: option.symbol,
                      icon: option.icon,
                      decimals: option.decimals,
                      name: option.name,
                      chainId: option.chainId,
                    });
                    onHide(true);
                  }}
                  key={option.address}
                >
                  <img
                    src={option.icon}
                    className="w-7 h-7 rounded-full mr-2"
                  />
                  <div className="grow">
                    <div>{option.symbol}</div>
                    <div className="text-textColorSecondary text-sm">
                      {option.name}
                    </div>
                  </div>
                  <div>
                    {tokenBalance[option.address]
                      ? tokenBalance[option.address].toFixed(4)
                      : "0.00"}
                  </div>
                </div>
              );
            })}
            {filteredResults.length === 0 && newToken.address && (
              <div
                className="flex mx-2 my-3 p-1 rounded-lg h-10 items-center text-sm font-medium"
                key={newToken.address}
              >
                <img
                  src={newToken.icon}
                  className="w-7 h-7 rounded-full mr-2"
                />
                <div className="grow">
                  <div>{newToken.symbol}</div>
                  <div className="text-textColorSecondary text-sm">
                    {newToken.name}
                  </div>
                </div>
                {address && (
                  <button
                    className="flex flex-row bg-pink-400 hover:bg-pink-800 w-full items-center justify-center whitespace-nowrap text-white rounded-lg font-medium text-sm px-3 h-10 cursor-pointer"
                    onClick={() => {
                      addNewToken();
                      setSearchQuery("");
                      handleSearch("");
                    }}
                  >
                    Import Token
                  </button>
                )}
              </div>
            )}
            {filteredResults.length === 0 && !newToken.address && (
              <div className="text-white font-medium text-base mt-2 ml-3">
                No Tokens Found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
