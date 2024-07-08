import { Flex, Text, type TextProps } from "@chakra-ui/react";
import { type FA12TokenBalance, type FA2TokenBalance, tokenNameSafe } from "@umami/core";
import { verifiedTokens } from "@umami/tezos";

import { VerifiedIcon } from "../../assets/icons";

export const TokenNameWithIcon = ({
  token,
  ...textProps
}: { token: FA12TokenBalance | FA2TokenBalance } & TextProps) => {
  const isVerified = verifiedTokens.includes(token.contract);
  return (
    <Flex alignItems="center">
      <Text {...textProps} marginRight="4px">
        {tokenNameSafe(token)}
      </Text>
      {isVerified && <VerifiedIcon />}
    </Flex>
  );
};
