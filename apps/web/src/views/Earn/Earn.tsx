import { Flex } from "@chakra-ui/react";
import Hotjar from "@hotjar/browser";
import {
  useCurrentAccount,
  useGetAccountBalanceDetails,
  useGetAccountDelegate,
} from "@umami/state";
import { BigNumber } from "bignumber.js";

import { EmptyMessage } from "../../components/EmptyMessage";
import { useIsAccountVerified } from "../../components/Onboarding/VerificationFlow";
import { VerifyMessage } from "../../components/Onboarding/VerificationFlow/VerifyMessage";
import { ViewOverlay } from "../../components/ViewOverlay/ViewOverlay";

export const Earn = () => {
  const isVerified = useIsAccountVerified();
  const currentAccount = useCurrentAccount()!;
  const address = currentAccount.address.pkh;
  const delegate = useGetAccountDelegate()(address);
  const { spendableBalance, totalBalance } = useGetAccountBalanceDetails(address);
  const isBalanceEqualToSpendable = BigNumber(totalBalance).isEqualTo(spendableBalance);

  const stakeTezosUrl = "https://stake.tezos.com/";

  Hotjar.stateChange("earn");

  const CtaMessage = ({
    cta,
    subtitle,
    title,
  }: {
    cta: string;
    subtitle: string;
    title: string;
  }) => <EmptyMessage cta={cta} ctaUrl={stakeTezosUrl} subtitle={subtitle} title={title} />;

  const getCtaMessage = () => {
    if (!isVerified) {
      return <VerifyMessage />;
    }

    if (!delegate) {
      return (
        <CtaMessage
          cta="Start earning"
          subtitle="Unlock the potential of your tez. Delegate or stake now and see your rewards grow."
          title="Earn rewards"
        />
      );
    }

    if (isBalanceEqualToSpendable) {
      return (
        <CtaMessage
          cta="Stake"
          subtitle="Maximize your tez with staking.com. Secure, efficient, and simple."
          title="Boost your rewards"
        />
      );
    }

    return (
      <CtaMessage
        cta="Manage funds"
        subtitle="Stake, unstake and finalize the unstaked tez using the Tezos staking app."
        title="Manage your funds"
      />
    );
  };

  return (
    <>
      <Flex zIndex={1} flexGrow={1} width="full">
        {getCtaMessage()}
      </Flex>
      <ViewOverlay iconType="earn" />
    </>
  );
};
