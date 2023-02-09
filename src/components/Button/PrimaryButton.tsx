import React from "react";

type Props = {
	buttonText: string;
	bgColor: string;
	width?: string;
	loading?: boolean;
	textColorPrimary?: string;
	disabled?: boolean;
	onClick?: () => void;
};

const PrimaryButton = ({
	buttonText,
	bgColor,
	width = "100%",
	loading = false,
	textColorPrimary = "#fff",
	disabled = false,
	onClick,
}: Props) => {
	return (
		<button
			className="px-4 py-4 disabled:opacity-75 disabled:cursor-not-allowed text-base font-semibold w-full rounded"
			style={{ backgroundColor: bgColor, width: width }}
			disabled={disabled}
			onClick={onClick}
		>
			<span style={{ color: textColorPrimary }}>
				{loading && (
					<img
						src="assets/loading.svg"
						className="inline animate-spin -ml-1 mr-2 h-5 w-5 text-white"
					/>
				)}{" "}
				{buttonText}
			</span>
		</button>
	);
};

export default PrimaryButton;
