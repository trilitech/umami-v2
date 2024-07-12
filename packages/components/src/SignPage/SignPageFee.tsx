import { Flex, Heading, Text } from "@chakra-ui/react";
import { prettyTezAmount } from "@umami/tezos";

export const SignPageFee = ({ fee }: { fee: string | number }) => (
  <Flex alignItems="center">
    <Heading marginRight="4px" color="gray.700" fontWeight="600" size="sm">
      Fee:
    </Heading>
    <Text color="gray.700" data-testid="fee" size="md">
      {prettyTezAmount(fee)}
    </Text>
  </Flex>
);
