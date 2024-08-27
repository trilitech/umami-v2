import { Flex, VStack } from "@chakra-ui/react";
import { fullId } from "@umami/core";
import { useCurrentAccount, useGetAccountAllTokens } from "@umami/state";

import { Token } from "./Token";
import { EmptyMessage, VerifyMessage } from "../../components/EmptyMessage";
import { useCheckVerified } from "../../components/Onboarding/useCheckUnverified";
import { ViewOverlay } from "../../components/ViewOverlay/ViewOverlay";

export const Tokens = () => {
  const isVerified = useCheckVerified();
  const currentAccount = useCurrentAccount()!;
  const availableTokens = useGetAccountAllTokens()(currentAccount.address.pkh);

  const buyTezUrl = `https://widget.wert.io/default/widget/?commodity=XTZ&address=${currentAccount.address.pkh}&network=tezos&commodity_id=xtz.simple.tezos`;

  return (
    <>
      <Flex zIndex={1} flexGrow={1} width="full">
        {availableTokens.length ? (
          <VStack width="full">
            {availableTokens.map(token => (
              <Token key={fullId(token)} token={token} />
            ))}
          </VStack>
        ) : isVerified ? (
          <EmptyMessage
            cta="Buy Tez Now"
            ctaUrl={buyTezUrl}
            subtitle={"You need Tez to take part in any activity.\n Buy some to get started."}
            title="Get Started with Tokens"
          />
        ) : (
          <VerifyMessage />
        )}
      </Flex>
      {!availableTokens.length && <ViewOverlay iconType="tokens" />}
    </>
  );
};
