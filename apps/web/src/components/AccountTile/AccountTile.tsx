import { Circle, Flex, type FlexProps, Heading } from "@chakra-ui/react";
import { type ImplicitAccount } from "@umami/core";
import { type PropsWithChildren } from "react";

import { AccountTileIcon } from "./AccountTileIcon";
import { useColor } from "../../styles/useColor";
import { CopyAddressButton } from "../CopyAddressButton";

export const AccountTile = ({
  account,
  children,
  ...props
}: PropsWithChildren<{ account: ImplicitAccount }> & FlexProps) => {
  const color = useColor();
  const address = account.address.pkh;

  return (
    <Flex
      gap="10px"
      borderRadius="full"
      _hover={{ background: color("100") }}
      cursor={props.onClick ? "pointer" : undefined}
      paddingY="12px"
      {...props}
    >
      <Circle
        marginLeft="12px"
        color={color("white")}
        background={color("white", "black")}
        filter="drop-shadow(0px 0px 12px rgba(45, 55, 72, 0.08))"
        size="48px"
      >
        <AccountTileIcon account={account} />
      </Circle>

      <Flex justifyContent="space-between" width="100%" marginRight="20px">
        <Flex justifyContent="center" flexDirection="column" gap="2px">
          <Heading color={color("900")} size="sm">
            {account.label}
          </Heading>
          <CopyAddressButton address={address} />
        </Flex>

        {children}
      </Flex>
    </Flex>
  );
};