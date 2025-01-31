import { type SocialAccount } from "@umami/core";
import { useDataPolling } from "@umami/data-polling";
import {
  useCurrentAccount,
  useGetAccountBalance,
  useGetDollarBalance,
  useSelectNetwork,
  useSelectedNetwork,
} from "@umami/state";
import { prettyTezAmount } from "@umami/tezos";
import type React from "react";
import { Button, Text, XStack, YStack } from "tamagui";

import { ActionButtonComponent, BalanceDisplayComponent, NetworkSwitchComponent } from "./components";
import { useSocialOnboarding } from "../../services/auth";

export const  HomeScreen: React.FC = () => {
  useDataPolling();

  const currentAccount = useCurrentAccount();
  const network = useSelectedNetwork();
  const selectNetwork = useSelectNetwork();
  const { logout } = useSocialOnboarding();

  const address = currentAccount ? currentAccount.address.pkh : "";
  const balance = useGetAccountBalance()(address);
  const balanceInUsd = useGetDollarBalance()(address);

  return (
    <YStack alignItems="center" flex={1} paddingTop={20} backgroundColor="white">
      <BalanceDisplayComponent balance={balance} />
      <XStack justifyContent="space-around" width="100%" marginVertical={20}>
        <ActionButtonComponent title="Buy" />
        <ActionButtonComponent title="Swap" />
        <ActionButtonComponent title="Receive" />
        <ActionButtonComponent title="Send" />
      </XStack>

      <YStack alignItems="center" marginTop={50}>
        <Text color="#333" fontSize={24} fontWeight="bold">
          Welcome to the Home Screen!
        </Text>
        <NetworkSwitchComponent network={network} selectNetwork={selectNetwork} />
      </YStack>

      <YStack alignItems="center" marginTop={20}>
        <Text>Current network: {network.name}</Text>
        <Text>Label: {currentAccount?.label}</Text>
        <Text>Address: {currentAccount?.address.pkh}</Text>
        <Text>Balance: {prettyTezAmount(balance ?? 0)}</Text>
        <Text>Balance in USD: {balanceInUsd?.toString() ?? "0"}</Text>
      </YStack>

      <Button
        marginTop={20}
        onPress={() => logout((currentAccount as SocialAccount).idp)}
        size="$4"
      >
        Logout
      </Button>
    </YStack>
  );
}
