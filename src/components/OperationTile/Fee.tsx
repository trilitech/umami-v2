import { Flex, Heading, Text } from "@chakra-ui/react";
import colors from "../../style/colors";
import { TzktCombinedOperation } from "../../utils/tezos";
import { BigNumber } from "bignumber.js";
import { prettyTezAmount } from "../../utils/format";
import { get } from "lodash";
const FEE_FIELDS = ["bakerFee", "storageFee", "allocationFee"];

export const Fee: React.FC<{ operation: TzktCombinedOperation }> = ({ operation }) => {
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
    <Flex align="center">
      <Heading size="sm" color={colors.gray[450]} mr="4px">
        Fee:
      </Heading>
      <Text color={colors.gray[400]} data-testid="fee">
        {prettyTezAmount(totalFee)}
      </Text>
    </Flex>
  );
};
