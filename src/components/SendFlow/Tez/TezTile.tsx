import { Flex, Heading } from "@chakra-ui/react";
import TezIcon from "../../../assets/icons/Tez";
import colors from "../../../style/colors";
import BigNumber from "bignumber.js";
import { prettyTezAmount } from "../../../utils/format";

const splitNumber = (num: string) => {
  const [integer, decimal] = num.split(".");
  return { integer, decimal };
};

export const TezTile: React.FC<{ tezAmount: BigNumber }> = ({ tezAmount }) => {
  const { integer, decimal } = splitNumber(prettyTezAmount(tezAmount));
  return (
    <Flex
      h="60px"
      w="100%"
      borderRadius="4px"
      bg={colors.gray[800]}
      alignItems="center"
      p="10px 8px 10px 8px"
    >
      <TezIcon m="5px" mr="12px" />
      <Flex alignItems="end">
        <Heading size="md">{integer}</Heading>
        <Heading size="sm">.{decimal}</Heading>
      </Flex>
    </Flex>
  );
};
