import React from "react";
import { useSwitchNetwork } from "wagmi";
import { useAppSelector } from "../../hooks";

type Props = {
  bgColor: string;
  width?: string;
  textColorPrimary?: string;
};

export const SwitchNetworkButton = ({
  bgColor,
  width = "100%",
  textColorPrimary = "#fff",
}: Props) => {
  const { switchNetwork } = useSwitchNetwork();
  const { chainsInfo, inputChainId } = useAppSelector((state) => state.chains);

  return (
    <button
      className="px-4 py-4 disabled:opacity-75 disabled:cursor-not-allowed text-base font-semibold w-full rounded"
      style={{
        backgroundColor: bgColor,
        width: width,
      }}
      onClick={() => switchNetwork?.(inputChainId)}
    >
      <div style={{ color: textColorPrimary }} className="flex justify-center">
        Switch to
        <img
          src={chainsInfo[inputChainId]?.icon}
          className="rounded-md w-6 h-6 mx-1"
        />
        {chainsInfo[inputChainId]?.name} Network
      </div>
    </button>
  );
};
