import React, { useState } from "react";
import { SettingsDropdown } from "../Dropdown";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useAccount } from "wagmi";

type WidgetHeaderProps = {
	setTabIndex: (tabIndex: number) => void;
};

export const WidgetHeader = ({ setTabIndex }: WidgetHeaderProps) => {
	const { address } = useAccount();
	const [hideUserSettingsDropdown, setHideUserSettingsDropdown] =
		useState(true);

	return (
		<div className="flex justify-between">
			<div className="font-medium text-zinc-400 text-xl">Bridge</div>
			<div className="flex">
				{address && (
					<div className="mr-3">
						<img
							onClick={() => setTabIndex(2)}
							id="history-icon-info"
							src="assets/history.png"
							className="h-5 w-5 self-center cursor-pointer"
						/>
						<ReactTooltip
							anchorId="history-icon-info"
							place="top"
							content="Transactions History"
						/>
					</div>
				)}
				<div className="relative">
					<img
						onClick={() =>
							setHideUserSettingsDropdown(
								!hideUserSettingsDropdown
							)
						}
						id="settings-icon-info"
						src="assets/settings.svg"
						className="h-5 w-5 self-center cursor-pointer"
					/>
					<ReactTooltip
						anchorId="settings-icon-info"
						place="top"
						content="Settings"
					/>
					{!hideUserSettingsDropdown && (
						<SettingsDropdown
							onHide={(val) => setHideUserSettingsDropdown(val)}
						/>
					)}
				</div>
			</div>
		</div>
	);
};
