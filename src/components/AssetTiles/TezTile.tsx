import { Flex, Heading } from "@chakra-ui/react";
import { prettyTezAmount } from "../../utils/format";
import TezIcon from "../../assets/icons/Tez";
import colors from "../../style/colors";

const splitNumber = (num: string) => {
  const [integer, decimal] = num.split(".");
  return { integer, decimal };
};

export const TezTile: React.FC<{ tezAmount: string }> = ({ tezAmount }) => {
  const { integer, decimal } = splitNumber(prettyTezAmount(tezAmount));
  return (
    <Flex h="60px" borderRadius="4px" bg={colors.gray[800]} alignItems="center" p="15px">
      <TezIcon mr="12px" />
      <Flex alignItems="end">
        <Heading size="md">{integer}</Heading>
        <Heading size="sm">.{decimal}</Heading>
      </Flex>
    </Flex>
  );
};
