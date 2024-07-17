import { Button, type ButtonProps, Text } from "@chakra-ui/react";
import { type RawPkh, formatPkh } from "@umami/tezos";
import { memo } from "react";

import { FileCopyIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";

// TODO: add a popover "copied"
export const CopyAddressButton = memo(
  ({ address, ...props }: { address: RawPkh } & ButtonProps) => {
    const color = useColor();

    return (
      <Button
        gap="4px"
        width="fit-content"
        padding="0"
        fontWeight="400"
        aria-label="Copy Address"
        onClick={event => {
          event.stopPropagation();
          return navigator.clipboard.writeText(address);
        }}
        variant="empty"
        {...props}
      >
        <Text display="inline" size="sm">
          {formatPkh(address)}
        </Text>
        <FileCopyIcon color={color("400")} />
      </Button>
    );
  }
);
