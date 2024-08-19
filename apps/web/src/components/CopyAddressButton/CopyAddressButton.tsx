import { type ButtonProps, Text } from "@chakra-ui/react";
import { type RawPkh, formatPkh } from "@umami/tezos";
import { memo } from "react";

import { FileCopyIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { CopyButton } from "../CopyButton/CopyButton";

export const CopyAddressButton = memo(
  ({ address, isLong = false, ...props }: { address: RawPkh; isLong?: boolean } & ButtonProps) => {
    const color = useColor();

    return (
      <CopyButton
        left="-8px"
        height="auto"
        padding="4px 8px"
        aria-label="Copy Address"
        variant="ghost"
        {...props}
        value={address}
      >
        <Text color={color("700")} size="sm">
          {isLong ? address : formatPkh(address)}
        </Text>
        <FileCopyIcon color={color("400")} />
      </CopyButton>
    );
  }
);
