import React, { useState } from "react";
import { SettingsDropdown } from "../Dropdown";

export const UserSettings = () => {
	const [hideUserSettingsDropdown, setHideUserSettingsDropdown] =
		useState(true);

	return (
		<div className="flex justify-between">
			<div className="font-medium text-zinc-400 text-xl">Bridge</div>
			<div className="relative">
				<img
					onClick={() =>
						setHideUserSettingsDropdown(!hideUserSettingsDropdown)
					}
					src="assets/settings.svg"
					className="h-5 w-5 self-center cursor-pointer"
				/>
				{!hideUserSettingsDropdown && (
					<SettingsDropdown
						onHide={(val) => setHideUserSettingsDropdown(val)}
					/>
				)}
			</div>
		</div>
	);
};
