import React, { useRef } from "react";
import { useClickAway } from "../../hooks";
import { useQuery } from "react-query";
import { getUserTokenBalances } from "../../services";
import { TokenDetail } from "../../types";
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

export const OutputTokenSelectDropdown = ({
	options,
	setTokenDetail,
	onHide,
	chainId,
}: Props) => {
	// options.sort((a, b) =>
	// 	a.symbol > b.symbol ? 1 : a.symbol < b.symbol ? -1 : 0
	// );

	const { address } = useAccount();
	const clickAwayRef = useRef<HTMLDivElement>(null);

	const balanceResponse = useQuery(
		["userTokenBalances"],
		() =>
			getUserTokenBalances({
				userAddress: address!,
			}),
		{
			enabled: !!address,
			refetchInterval: 10000
		}
	);

	const tokenBalance = getUserBalanceOfChainId(balanceResponse, chainId);

	useClickAway(clickAwayRef, () => onHide(true));

	return (
		<div
			ref={clickAwayRef}
			className="absolute text-white bg-[#141529] top-[2.5rem] py-2 rounded z-10 w-full border-2 border-[#23263b]"
		>
			<div className="flex m-1 flex-col">
				<div className="flex flex-row my-2 text-xs text-textColorSecondary mx-2">
					<div className="grow ml-1">Token Name</div>
					<div className="mr-3">Balance</div>
				</div>
				<div style={{ height: "250px", overflowY: "scroll" }}>
					{options.map((option) => {
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
										? tokenBalance[option.address].toFixed(
												4
										  )
										: "0.00"}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
};
