import { Flex } from "@chakra-ui/react";

import { TezIcon } from "../../assets/icons";
import colors from "../../style/colors";
import { prettyTezAmount } from "../../utils/format";
import { PrettyNumber } from "../PrettyNumber";

export const TezTile: React.FC<{ mutezAmount: string | number }> = ({ mutezAmount }) => (
  <Flex
    alignItems="center"
    height="60px"
    padding="15px"
    background={colors.gray[800]}
    borderRadius="4px"
  >
    <TezIcon marginRight="12px" />
    <Flex alignItems="end">
      <PrettyNumber number={prettyTezAmount(mutezAmount)} />
    </Flex>
  </Flex>
);
