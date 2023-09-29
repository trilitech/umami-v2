import { Center, Heading, Text } from "@chakra-ui/react";
import colors from "../../style/colors";
import { TzktCombinedOperation } from "../../utils/tezos";
import { BigNumber } from "bignumber.js";
import { prettyTezAmount } from "../../utils/format";
import { get } from "lodash";
import { useIsOwnedAddress } from "../../utils/hooks/accountHooks";
const FEE_FIELDS = ["bakerFee", "storageFee", "allocationFee"];

export const Fee: React.FC<{
  operation: TzktCombinedOperation;
}> = ({ operation }) => {
  const isOutgoing = useIsOwnedAddress(operation.sender?.address as string);

  // if the wallet holder paid the fee then we show it, otherwise there is no need to
  if (!isOutgoing) {
    return null;
  }

  const totalFee = FEE_FIELDS.reduce((acc, curr) => {
    if (curr in operation) {
      return acc.plus(get(operation, curr) || 0);
    }

    return acc;
  }, BigNumber(0));

  if (totalFee.eq(0)) {
    return null;
  }

  return (
    <Center>
      <Heading size="sm" color={colors.gray[450]} mr="4px">
        Fee:
      </Heading>
      <Text size="sm" color={colors.gray[400]} data-testid="fee">
        {prettyTezAmount(totalFee)}
      </Text>
    </Center>
  );
};
