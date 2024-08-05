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
export const AddressTile = ({ address, ...flexProps }: { address: Address } & FlexProps) => {
  const addressKind = useAddressKind(address);
  const color = useColor();

  const balance = useGetAccountBalance()(address.pkh);

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
      <Flex gap="16px" width="full">
        <AccountTileWrapper>
          <AddressTileIcon addressKind={addressKind} size="sm" />
        </AccountTileWrapper>

        <Flex justifyContent="center" flexDirection="column" width="full">
          <Heading size="md">{addressKind.label}</Heading>

          <Flex justifyContent="space-between">
            <CopyAddressButton
              color={color("700")}
              address={address.pkh}
              isLong={addressKind.type === "unknown"}
            />
            <Text size="sm">{balance !== undefined && prettyTezAmount(balance)}</Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
