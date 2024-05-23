import { Flex } from "@chakra-ui/react";
import BigNumber from "bignumber.js";

import { TezIcon } from "../../assets/icons";
import colors from "../../style/colors";
import { prettyTezAmount } from "../../utils/format";
import { PrettyNumber } from "../PrettyNumber";

export const TezTile: React.FC<{ mutezAmount: string | number | BigNumber }> = ({
  mutezAmount,
}) => (
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
