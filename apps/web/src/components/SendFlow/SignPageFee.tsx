import { Flex, Heading, Text } from "@chakra-ui/react";
import { prettyTezAmount } from "@umami/tezos";

import { useColor } from "../../styles/useColor";

export const SignPageFee = ({ fee }: { fee: string | number }) => {
  const color = useColor();

  return (
    <Flex alignItems="center">
      <Heading marginRight="4px" color={color("450")} size="sm">
        Fee:
      </Heading>
      <Text color={color("400")} data-testid="fee" size="sm">
        {prettyTezAmount(fee)}
      </Text>
    </Flex>
  );
};
