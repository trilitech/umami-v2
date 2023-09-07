import { Flex } from "@chakra-ui/react";
import { prettyTezAmount } from "../../utils/format";
import TezIcon from "../../assets/icons/Tez";
import colors from "../../style/colors";
import { PrettyNumber } from "../PrettyNumber";

export const TezTile: React.FC<{ mutezAmount: string }> = ({ mutezAmount }) => {
  return (
    <Flex h="60px" borderRadius="4px" bg={colors.gray[800]} alignItems="center" p="15px">
      <TezIcon mr="12px" />
      <Flex alignItems="end">
        <PrettyNumber number={prettyTezAmount(mutezAmount)} />
      </Flex>
    </Flex>
  );
};
