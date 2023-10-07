import { Flex, Text, Heading, FlexProps, Box } from "@chakra-ui/react";
import { Address } from "../../types/Address";
import useAddressKind from "./useAddressKind";
import AddressTileIcon from "./AddressTileIcon";
import { PrettyNumber } from "../PrettyNumber";
import { useGetAccountBalance } from "../../utils/hooks/assetsHooks";
import { formatPkh, prettyTezAmount } from "../../utils/format";
import colors from "../../style/colors";

const AddressTile: React.FC<{ address: Address } & FlexProps> = ({ address, ...flexProps }) => {
  const addressKind = useAddressKind(address);
  const getBalance = useGetAccountBalance();
  const balance = getBalance(addressKind.pkh);
  return (
    <Flex
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
            <Text color={colors.gray[300]} size="xs" ml="10px" width="88px">
              {formatPkh(addressKind.pkh)}
            </Text>
          </>
        )}
      </Flex>

      <Box textAlign="right">{balance && <PrettyNumber number={prettyTezAmount(balance)} />}</Box>
    </Flex>
  );
};

export default AddressTile;
