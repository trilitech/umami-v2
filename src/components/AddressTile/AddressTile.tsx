import { Flex, Text, Heading, FlexProps } from "@chakra-ui/react";
import { Address } from "../../types/Address";
import useAddressKind from "./useAddressKind";
import AddressTileIcon from "./AddressTileIcon";
import { PrettyNumber } from "../PrettyNumber";
import { useGetAccountBalance } from "../../utils/hooks/assetsHooks";
import { formatPkh, prettyTezAmount, truncate } from "../../utils/format";
import colors from "../../style/colors";

const AddressTile: React.FC<{ address: Address } & FlexProps> = ({ address, ...flexProps }) => {
  const addressKind = useAddressKind(address);
  const { label, type, pkh } = addressKind;
  const getBalance = useGetAccountBalance();
  const balance = getBalance(addressKind.pkh);
  return (
    <Flex
      alignItems="center"
      w="400px"
      p="9px 15px"
      borderRadius="4px"
      bg={colors.gray[800]}
      justifyContent="space-between"
      {...flexProps}
    >
      <Flex alignItems="center">
        <AddressTileIcon addressKind={addressKind} />

        {label && (
          <Heading size="sm" ml="12px">
            {truncate(label, 15)}
          </Heading>
        )}

        <Text color={colors.gray[300]} size="sm" ml="10px">
          {type === "unknown" ? address.pkh : formatPkh(pkh)}
        </Text>
      </Flex>

      {balance && <PrettyNumber number={prettyTezAmount(balance)} />}
    </Flex>
  );
};

export default AddressTile;
