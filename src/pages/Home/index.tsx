import React from "react";

const Home = () => {
	return (
		<div className="max-w-screen-xl py-16 px-8 m-auto flex flex-col">
			{/* Buy GLP heading */}
			<div className="mb-7">
				<div className="text-4xl font-medium text-white pb-2">
					Buy GLP
				</div>
				<div className="text-medium font-medium text-zinc-400">
					Purchase{" "}
					<a
						className="underline underline-offset-2"
						href="https://gmxio.gitbook.io/gmx/glp"
						target="_blank"
					>
						GLP tokens
					</a>{" "}
					from any chain to earn fees on Arbitrum/Avalanche.
				</div>
			</div>

			{/* GLP Stats and Widget */}
			<div className="flex justify-between">
				{/* GLP Stats */}
				<div className="max-w-[44.5rem] bg-[#17192E] w-full mr-4 rounded divide-y divide-[#23263b] border border-[#23263b]">
					<div className="flex p-4">
						<img
							src={"assets/ic_glp_arbitrum.svg"}
							alt="IC Glp Logo"
							className="w-10 h-10"
						/>
						<div className="pl-1">
							<div className="text-base text-white font-semibold leading-5">
								GLP
							</div>
							<div className="text-xs text-zinc-500 font-medium">
								ARBI
							</div>
						</div>
					</div>
					<div className="p-4">
						<div className="w-full flex justify-between pb-1">
							<div className="text-base text-zinc-400 font-medium">
								Price
							</div>
							<div className="text-base text-white font-medium">
								$0.940
							</div>
						</div>
						<div className="w-full flex justify-between pb-1">
							<div className="text-base text-zinc-400 font-medium">
								Wallet
							</div>
							<div className="text-base text-white font-medium">
								0.0000 GLP ($0.00)
							</div>
						</div>
						<div className="w-full flex justify-between">
							<div className="text-base text-zinc-400 font-medium">
								Staked
							</div>
							<div className="text-base text-white font-medium">
								0.0000 GLP ($0.00)
							</div>
						</div>
					</div>
					<div className="p-4">
						<div className="w-full flex justify-between pb-1">
							<div className="text-base text-zinc-400 font-medium">
								APR
							</div>
							<div className="text-base text-white font-medium">
								19.51%
							</div>
						</div>
						<div className="w-full flex justify-between pb-1">
							<div className="text-base text-zinc-400 font-medium">
								Total Supply
							</div>
							<div className="text-base text-white font-medium">
								435,027,592.6820 GLP ($408,982,348.22)
							</div>
						</div>
					</div>
				</div>
				<div className="max-w-[30rem] w-full bg-[#17192E] rounded">
					hi
				</div>
			</div>
		</div>
	);
};

export default Home;
