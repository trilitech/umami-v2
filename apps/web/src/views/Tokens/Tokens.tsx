import { Flex, VStack } from "@chakra-ui/react";
import { fullId } from "@umami/core";
import { useCurrentAccount, useGetAccountAllTokens } from "@umami/state";

import { Token } from "./Token";
import { EmptyMessage } from "../../components/EmptyMessage";

export const Tokens = () => {
  const currentAccount = useCurrentAccount()!;
  const availableTokens = useGetAccountAllTokens()(currentAccount.address.pkh);

  const buyTezUrl = `https://widget.wert.io/default/widget/?commodity=XTZ&address=${currentAccount.address.pkh}&network=tezos&commodity_id=xtz.simple.tezos`;

  return (
    <Flex flexGrow={1} width="full">
      {availableTokens.length ? (
        <VStack width="full">
          {availableTokens.map(token => (
            <Token key={fullId(token)} token={token} />
          ))}
        </VStack>
      ) : (
        <EmptyMessage
          cta="Buy Tez Now"
          ctaUrl={buyTezUrl}
          subtitle={"You need Tez to take part in any activity.\n Buy some to get started."}
          title="Get Started with Tokens"
        />
      )}
    </Flex>
  );
};
