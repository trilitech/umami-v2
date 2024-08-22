import { Flex, type FlexProps, Heading, Text } from "@chakra-ui/react";
import { useAddressKind } from "@umami/components";
import { useGetAccountBalance } from "@umami/state";
import { type Address, prettyTezAmount } from "@umami/tezos";

import { AddressTileIcon } from "./AddressTileIcon";
import { useColor } from "../../styles/useColor";
import { AccountTileWrapper } from "../AccountTile/AccountTileWrapper";
import { CopyAddressButton } from "../CopyAddressButton";

/**
 * Tile component for displaying account (owned / unknown) / contact / baker.
 *
 * Contains icon, label (optional), address and balance (optional).
 * Displays tooltip with the full label when hovered (if label is present).
 *
 * @param address - Account address.
 * @param flexProps - Defines component style.
 * @param hideBalance - If true, balance will not be displayed.
 */
export const AddressTile = ({
  size = "sm",
  address,
  ...flexProps
}: { address: Address; size?: "xs" | "sm" } & FlexProps) => {
  const addressKind = useAddressKind(address);
  const color = useColor();

  const balance = useGetAccountBalance()(address.pkh);
  const isSmall = size === "xs";

  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      width="100%"
      padding="12px 16px"
      background={color("50")}
      borderRadius="4px"
      data-testid="address-tile"
      {...flexProps}
    >
      <Flex alignItems="center" gap="16px" width="full">
        <AccountTileWrapper size={size}>
          <AddressTileIcon addressKind={addressKind} size={size} />
        </AccountTileWrapper>

        <Flex
          justifyContent={isSmall ? "space-between" : "center"}
          flexDirection={{ base: "column", md: isSmall ? "row" : "column" }}
          width="full"
        >
          <Flex
            alignItems="center"
            overflow="hidden"
            width="150px"
            marginRight="10px"
            whiteSpace="nowrap"
          >
            <Heading overflow="hidden" textOverflow="ellipsis" size={isSmall ? "sm" : "md"}>
              {addressKind.label}
            </Heading>
          </Flex>

          <Flex alignItems="center" justifyContent="space-between" width="full">
            <CopyAddressButton
              color={color("700")}
              fontSize={isSmall ? "12px" : "14px"}
              address={address.pkh}
              isCopyDisabled={isSmall}
              isLong={addressKind.type === "unknown"}
              variant={isSmall ? "unstyled" : "ghost"}
            />
            <Text size="sm">{balance !== undefined && prettyTezAmount(balance)}</Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
