import { Flex, Text, Heading, FlexProps, Box, Tooltip } from "@chakra-ui/react";
import { Address } from "../../types/Address";
import useAddressKind from "./useAddressKind";
import AddressTileIcon from "./AddressTileIcon";
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
const AddressTile: React.FC<{ address: Address } & FlexProps> = ({ address, ...flexProps }) => {
  const addressKind = useAddressKind(address);

  return (
    <Tooltip hasArrow placement="left" bg={colors.white} label={addressKind.label}>
      <Flex
        data-testid="address-tile"
        alignItems="center"
        w="400px"
        p="9px 10px"
        borderRadius="4px"
        bg={colors.gray[800]}
        justifyContent="space-between"
        {...flexProps}
      >
        <Flex alignItems="center">
          <AddressTileIcon addressKind={addressKind} />

          {addressKind.type === "unknown" ? (
            <Text color={colors.gray[300]} size="sm" ml="10px">
              {address.pkh}
            </Text>
          ) : (
            <>
              <Box ml="12px" width="102px" whiteSpace="nowrap" overflow="hidden">
                <Heading size="sm" overflow="hidden" textOverflow="ellipsis">
                  {addressKind.label}
                </Heading>
              </Box>
              <Text color={colors.gray[300]} size="xs" ml="10px" width="89px">
                {formatPkh(addressKind.pkh)}
              </Text>
            </>
          )}
        </Flex>

        <AccountBalance textAlign="right" overflow="hidden" address={address.pkh} />
      </Flex>
    </Tooltip>
  );
};

export default AddressTile;
