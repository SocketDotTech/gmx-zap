import { midnightTheme, Theme } from "@rainbow-me/rainbowkit";
import merge from "lodash.merge";

export const customTheme: Theme = merge(midnightTheme(), {
	colors: {
		accentColor: "#2F3ED9",
		accentColorForeground: "white",
		modalBackground: "#17192E",
		profileForeground: "#17192E",
		connectButtonBackground: "#17192E",
		modalBorder: "#363646",
	},
	radii: {
		connectButton: "8px",
	},
} as Theme);
