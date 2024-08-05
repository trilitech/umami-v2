import { Flex, Heading, Text } from "@chakra-ui/react";
import { prettyTezAmount } from "@umami/tezos";

import { useColor } from "../../styles/useColor";

export const SignPageFee = ({ fee }: { fee: string | number }) => {
  const color = useColor();

  return (
    <Flex alignItems="center">
      <Heading marginRight="4px" color={color("700")} size="md">
        Fee:
      </Heading>
      <Text data-testid="fee">{prettyTezAmount(fee)}</Text>
    </Flex>
  );
};
