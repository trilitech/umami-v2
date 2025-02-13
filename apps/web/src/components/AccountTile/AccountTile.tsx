import { Flex, type FlexProps, Heading } from "@chakra-ui/react";
import { type ImplicitAccount } from "@umami/core";
import { truncate } from "@umami/tezos";
import { type PropsWithChildren } from "react";

import { AccountTileIcon } from "./AccountTileIcon";
import { AccountTileWrapper } from "./AccountTileWrapper";
import { useColor } from "../../styles/useColor";
import { CopyAddressButton } from "../CopyAddressButton";

export const AccountTile = ({
  account,
  children,
  size = "sm",
  ...props
}: PropsWithChildren<{ account: ImplicitAccount; size?: "xs" | "sm" }> & FlexProps) => {
  const color = useColor();
  const address = account.address.pkh;

  const sizes = {
    xs: 20,
    sm: 30,
  };

  const isSmall = size === "xs";
  const copyButtonStyles = isSmall
    ? {
        padding: 0,
        left: 0,
      }
    : {};

  return (
    <Flex
      gap={isSmall ? "6px" : "10px"}
      padding={isSmall ? "6px 12px 6px 6px" : "12px 0 12px 16px"}
      borderRadius="full"
      _hover={{ background: color("100") }}
      cursor={props.onClick ? "pointer" : undefined}
      data-testid="account-tile"
      {...props}
    >
      <AccountTileWrapper size={size}>
        <AccountTileIcon account={account} size={sizes[size]} />
      </AccountTileWrapper>

      <Flex justifyContent="space-between" width="100%" marginRight={isSmall ? 0 : "20px"}>
        <Flex justifyContent="center" flexDirection="column" gap="2px">
          {!isSmall && (
            <Heading color={color("900")} size="sm">
              {account.type === "social" ? truncate(account.label, 28) : account.label}
            </Heading>
          )}
          <CopyAddressButton address={address} isCopyDisabled={isSmall} {...copyButtonStyles} />
        </Flex>

        {children}
      </Flex>
    </Flex>
  );
};
