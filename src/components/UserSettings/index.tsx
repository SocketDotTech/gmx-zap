import React from "react";

export const UserSettings = () => {
	return (
		<div className="flex justify-between">
			<div className="font-medium text-zinc-400 text-xl">Bridge</div>
			<img
				src="assets/settings.svg"
				className="h-5 w-5 self-center cursor-pointer"
			/>
		</div>
	);
};
