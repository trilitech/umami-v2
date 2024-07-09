import { Flex, VStack } from "@chakra-ui/react";
import { fullId } from "@umami/core";
import { useAppSelector, useGetAccountAllTokens } from "@umami/state";

import { Token } from "./Token";
import { EmptyMessage } from "../../components/EmptyMessage";

export const Tokens = () => {
  const getTokens = useGetAccountAllTokens();
  const account = useAppSelector(s => s.accounts.items)[0];
  const availableTokens = [...getTokens(account.address.pkh)];

  return (
    <Flex width="full">
      {availableTokens.length ? (
        <VStack width="full">
          {availableTokens.map(token => (
            <Token key={fullId(token)} token={token} />
          ))}
        </VStack>
      ) : (
        <EmptyMessage subtitle="Tokens" title="Tokens" />
      )}
    </Flex>
  );
};
