import { Box, Flex, type FlexProps, Heading, Text, Tooltip } from "@chakra-ui/react";
import { useAddressKind } from "@umami/components";
import { type Address, formatPkh } from "@umami/tezos";

import { AddressTileIcon } from "./AddressTileIcon";
import { useColor } from "../../styles/useColor";

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
  address,
  hideBalance = false,
  ...flexProps
}: { address: Address; hideBalance?: boolean } & FlexProps) => {
  const addressKind = useAddressKind(address);
  const color = useColor();

  return (
    <Tooltip background={color("white")} hasArrow label={addressKind.label} placement="left">
      <Flex
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        padding="9px 10px"
        background={color("800")}
        borderRadius="4px"
        data-testid="address-tile"
        {...flexProps}
      >
        <Flex alignItems="center" width={hideBalance ? "100%" : "calc(100% - 95px)"}>
          <AddressTileIcon addressKind={addressKind} size="sm" />

          {addressKind.type === "unknown" ? (
            <Text marginLeft="10px" color={color("300")} size="sm">
              {address.pkh}
            </Text>
          ) : (
            <>
              <Box overflow="hidden" width="100%" marginLeft="10px" whiteSpace="nowrap">
                <Heading overflow="hidden" textOverflow="ellipsis" size="sm">
                  {addressKind.label}
                </Heading>
              </Box>
              <Text width="89px" marginLeft="10px" color={color("300")} size="xs">
                {formatPkh(addressKind.pkh)}
              </Text>
            </>
          )}
        </Flex>
      </Flex>
    </Tooltip>
  );
};
