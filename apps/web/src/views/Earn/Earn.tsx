import { Flex } from "@chakra-ui/react";

import { EmptyMessage } from "../../components/EmptyMessage";
import { useIsAccountVerified } from "../../components/Onboarding/VerificationFlow";
import { VerifyMessage } from "../../components/Onboarding/VerificationFlow/VerifyMessage";
import { ViewOverlay } from "../../components/ViewOverlay/ViewOverlay";

export const Earn = () => {
  const isVerified = useIsAccountVerified();

  const stakeTezosUrl = "https://stake.tezos.com/";

  return (
    <>
      <Flex zIndex={1} flexGrow={1} width="full">
        {isVerified ? (
          <EmptyMessage
            cta="Start Earning"
            ctaUrl={stakeTezosUrl}
            subtitle={"Maximize your tez with staking.com.\nSecure, efficient, and simple."}
            title="Boost your rewards"
          />
        ) : (
          <VerifyMessage />
        )}
      </Flex>
      <ViewOverlay iconType="earn" />
    </>
  );
};
