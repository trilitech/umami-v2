import { Box, Flex, FlexProps, Heading, Text, Tooltip } from "@chakra-ui/react";

import { AddressTileIcon } from "./AddressTileIcon";
import { useAddressKind } from "./useAddressKind";
import colors from "../../style/colors";
import { Address } from "../../types/Address";
import { formatPkh } from "../../utils/format";
import { AccountBalance } from "../AccountBalance";

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
export const AddressTile: React.FC<{ address: Address; hideBalance?: boolean } & FlexProps> = ({
  address,
  hideBalance = false,
  ...flexProps
}) => {
  const addressKind = useAddressKind(address);

  return (
    <Tooltip background={colors.white} hasArrow label={addressKind.label} placement="left">
      <Flex
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        padding="9px 10px"
        background={colors.gray[800]}
        borderRadius="4px"
        data-testid="address-tile"
        {...flexProps}
      >
        <Flex alignItems="center" width={hideBalance ? "100%" : "calc(100% - 95px)"}>
          <AddressTileIcon addressKind={addressKind} />

          {addressKind.type === "unknown" ? (
            <Text marginLeft="10px" color={colors.gray[300]} size="sm">
              {address.pkh}
            </Text>
          ) : (
            <>
              <Box overflow="hidden" width="100%" marginLeft="10px" whiteSpace="nowrap">
                <Heading overflow="hidden" textOverflow="ellipsis" size="sm">
                  {addressKind.label}
                </Heading>
              </Box>
              <Text width="89px" marginLeft="10px" color={colors.gray[300]} size="xs">
                {formatPkh(addressKind.pkh)}
              </Text>
            </>
          )}
        </Flex>

        {!hideBalance && (
          <AccountBalance
            overflow="hidden"
            marginLeft="10px"
            textAlign="right"
            address={address.pkh}
            numberProps={{ maxWidth: "85px" }}
          />
        )}
      </Flex>
    </Tooltip>
  );
};
