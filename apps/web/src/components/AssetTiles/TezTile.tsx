import { Flex, Icon } from "@chakra-ui/react";
import { prettyTezAmount } from "@umami/tezos";
import type BigNumber from "bignumber.js";

import { PrettyNumber } from "./PrettyNumber";
import { StubIcon as TezIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";

export const TezTile = ({ mutezAmount }: { mutezAmount: string | number | BigNumber }) => {
  const color = useColor();
  return (
    <Flex
      alignItems="center"
      width="100%"
      height="60px"
      padding="15px"
      background={color("200")}
      borderRadius="4px"
    >
      <Icon as={TezIcon} marginRight="12px" />
      <Flex alignItems="end">
        <PrettyNumber number={prettyTezAmount(mutezAmount)} />
      </Flex>
    </Flex>
  );
};
