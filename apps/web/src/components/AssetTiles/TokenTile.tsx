import { AspectRatio, Flex, type FlexProps, Heading, Text } from "@chakra-ui/react";
import {
  type FA12TokenBalance,
  type FA2TokenBalance,
  tokenPrettyAmount,
  tokenSymbolSafe,
} from "@umami/core";

import { TokenIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";

export const TokenTile = ({
  token,
  amount,
  ...flexProps
}: { token: FA12TokenBalance | FA2TokenBalance; amount: string } & FlexProps) => {
  const color = useColor();
  const { contract } = token;

  const prettyAmount = tokenPrettyAmount(amount, token);
  const symbol = tokenSymbolSafe(token);

  return (
    <Flex
      alignItems="center"
      justifyContent="start"
      width="full"
      padding="16px"
      background={color("100")}
      borderRadius="6px"
      data-testid="token-tile"
      {...flexProps}
    >
      <Flex alignItems="center">
        <AspectRatio width="42px" marginRight="12px" ratio={1}>
          <TokenIcon boxSize="42px" contract={contract} rounded="full" />
        </AspectRatio>
      </Flex>
      <Flex alignItems="baseline">
        <Heading color={color("900")} data-testid="pretty-number" size="md">
          {prettyAmount}
        </Heading>
        <Text marginLeft="4px" color={color("900")} size="xl">
          {symbol}
        </Text>
      </Flex>
    </Flex>
  );
};
