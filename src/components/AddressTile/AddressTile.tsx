import { Flex, Text, Heading, FlexProps, Box, Tooltip } from "@chakra-ui/react";
import { Address } from "../../types/Address";
import { useAddressKind } from "./useAddressKind";
import { AddressTileIcon } from "./AddressTileIcon";
import { formatPkh } from "../../utils/format";
import colors from "../../style/colors";
import { AccountBalance } from "../AccountBalance";

/**
 * Tile component for displaying account (owned / unknown) / contact / baker.
 *
 * Contains icon, label (optional), address and balance (optional).
 * Displays tooltip with the full label when hovered (if label is present).
 *
 * @param address - Account address.
 * @param flexProps - Defines component style.
 */
export const AddressTile: React.FC<{ address: Address } & FlexProps> = ({
  address,
  ...flexProps
}) => {
  const addressKind = useAddressKind(address);

  return (
    <Tooltip background={colors.white} hasArrow label={addressKind.label} placement="left">
      <Flex
        alignItems="center"
        justifyContent="space-between"
        width="400px"
        padding="9px 10px"
        background={colors.gray[800]}
        borderRadius="4px"
        data-testid="address-tile"
        {...flexProps}
      >
        <Flex alignItems="center">
          <AddressTileIcon addressKind={addressKind} />

          {addressKind.type === "unknown" ? (
            <Text marginLeft="10px" color={colors.gray[300]} size="sm">
              {address.pkh}
            </Text>
          ) : (
            <>
              <Box overflow="hidden" width="102px" marginLeft="12px" whiteSpace="nowrap">
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

        <AccountBalance overflow="hidden" textAlign="right" address={address.pkh} />
      </Flex>
    </Tooltip>
  );
};
