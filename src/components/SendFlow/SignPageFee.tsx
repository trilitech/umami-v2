import colors from "../../style/colors";
import { prettyTezAmount } from "../../utils/format";
import { Flex, Heading, Text } from "@chakra-ui/react";
import BigNumber from "bignumber.js";
const SignPageFee: React.FC<{ fee: string | BigNumber }> = ({ fee }) => {
  return (
    <Flex alignItems="center">
      <Heading size="sm" mr="4px" color={colors.gray[450]}>
        Fee:
      </Heading>
      <Text size="sm" data-testid="fee" color={colors.gray[400]}>
        {prettyTezAmount(fee)}
      </Text>
    </Flex>
  );
};

export default SignPageFee;
