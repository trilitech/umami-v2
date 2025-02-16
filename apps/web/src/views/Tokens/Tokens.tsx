import { Flex, VStack } from "@chakra-ui/react";
import { fullId } from "@umami/core";
import { useBuyTezUrl, useCurrentAccount, useGetAccountAllTokens } from "@umami/state";

import { Token } from "./Token";
import { EmptyMessage } from "../../components/EmptyMessage";
import { useIsAccountVerified } from "../../components/Onboarding/VerificationFlow";
import { VerifyMessage } from "../../components/Onboarding/VerificationFlow/VerifyMessage";
import { ViewOverlay } from "../../components/ViewOverlay/ViewOverlay";

export const Tokens = () => {
  const isVerified = useIsAccountVerified();
  const currentAccount = useCurrentAccount()!;
  const availableTokens = useGetAccountAllTokens()(currentAccount.address.pkh);

  const buyTezUrl = useBuyTezUrl(currentAccount.address.pkh);

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
            cta="Buy tez now"
            ctaUrl={buyTezUrl}
            subtitle={"You need tez to take part in any activity.\n Buy some to get started."}
            title="Get started with tokens"
          />
        ) : (
          <VerifyMessage />
        )}
      </Flex>
      {!availableTokens.length && <ViewOverlay iconType="tokens" />}
    </>
  );
};
