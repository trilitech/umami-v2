import { Flex } from "@chakra-ui/react";
import { prettyTezAmount } from "@umami/tezos";
import { type BigNumber } from "bignumber.js";

import { TezIcon } from "../../assets/icons";
import colors from "../../style/colors";
import { PrettyNumber } from "../PrettyNumber";

export const TezTile = ({ mutezAmount }: { mutezAmount: string | number | BigNumber }) => (
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
