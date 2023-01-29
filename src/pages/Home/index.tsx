import React from "react";
import GlpBuyWidget from "../../components/GlpBuyWidget";
import GlpStats from "../../components/GlpStats";

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
			<div className="flex justify-between max-[900px]:flex-col">
				<GlpStats />
				<GlpBuyWidget />
			</div>
		</div>
	);
};

export default Home;
