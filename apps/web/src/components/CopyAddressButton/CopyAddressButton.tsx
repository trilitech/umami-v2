import { type ButtonProps, Text } from "@chakra-ui/react";
import { type RawPkh, formatPkh } from "@umami/tezos";
import { memo } from "react";

import { FileCopyIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { CopyButton } from "../CopyButton/CopyButton";

export const CopyAddressButton = memo(
  ({
    address,
    fontSize = "14px",
    isLong = false,
    isCopyDisabled = false,
    ...props
  }: { address: RawPkh; isLong?: boolean; isCopyDisabled?: boolean } & ButtonProps) => {
    const color = useColor();

    return (
      <CopyButton
        left="-8px"
        height="auto"
        padding="4px 8px"
        fontSize={fontSize}
        aria-label="Copy Address"
        isCopyDisabled={isCopyDisabled}
        variant="ghost"
        {...props}
        value={address}
      >
        <Text color={color("700")} fontSize="inherit">
          {isLong ? address : formatPkh(address)}
        </Text>
        {isCopyDisabled || <FileCopyIcon color={color("400")} />}
      </CopyButton>
    );
  }
);
