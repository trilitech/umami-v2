import { AspectRatio, Flex, type FlexProps, Text } from "@chakra-ui/react";
import {
  type FA12TokenBalance,
  type FA2TokenBalance,
  tokenPrettyAmount,
  tokenSymbolSafe,
} from "@umami/core";

import { PrettyNumber } from "./PrettyNumber";
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
      padding="15px"
      background={color("100")}
      borderRadius="4px"
      data-testid="token-tile"
      {...flexProps}
    >
      <Flex alignItems="center">
        <AspectRatio width="30px" marginRight="12px" ratio={1}>
          <TokenIcon
            padding="6.25px"
            background={color("200")}
            borderRadius="4px"
            contract={contract}
          />
        </AspectRatio>
      </Flex>
      <PrettyNumber number={prettyAmount} />
      <Text marginLeft="4px" size="sm">
        {symbol}
      </Text>
    </Flex>
  );
};
