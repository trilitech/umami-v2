import { ArrowDown, ArrowUpRight, Repeat, Wallet } from "@tamagui/lucide-icons";
import { type SocialAccount } from "@umami/core";
import {
  useCurrentAccount,
  useGetAccountBalance,
  useGetDollarBalance,
  useSelectNetwork,
  useSelectedNetwork,
} from "@umami/state";
import { prettyTezAmount } from "@umami/tezos";
import { Button, Text, XStack, YStack } from "tamagui";

import { ActionButton, BalanceDisplay, NetworkSwitch } from "./components";
import { FormPage } from "../../components/SendFlow/Tez";
import { useModal } from "../../providers/ModalProvider";
import { useSocialOnboarding } from "../../services/auth";

export const Home = () => {
  const currentAccount = useCurrentAccount();
  const network = useSelectedNetwork();
  const selectNetwork = useSelectNetwork();
  const { logout } = useSocialOnboarding();
  const { showModal } = useModal();

  const address = currentAccount ? currentAccount.address.pkh : "";
  const balance = prettyTezAmount(useGetAccountBalance()(address) ?? 0);
  const balanceInUsd = useGetDollarBalance()(address);

  return (
    <YStack alignItems="center" flex={1} paddingTop={20} backgroundColor="white">
      <BalanceDisplay balance={balance} balanceInUsd={balanceInUsd?.toString()} />
      <XStack justifyContent="space-around" width="100%" marginVertical={20}>
        <ActionButton icon={<Wallet />} title="Buy" />
        <ActionButton icon={<Repeat />} title="Swap" />
        <ActionButton icon={<ArrowDown />} title="Receive" />
        <ActionButton
          icon={<ArrowUpRight boxSizing="24px" />}
          onPress={() => showModal(<FormPage sender={currentAccount} />)}
          title="Send"
        />
      </XStack>

      <YStack alignItems="center" marginTop={50}>
        <Text color="#333" fontSize={24} fontWeight="bold">
          Welcome to the Home Screen!
        </Text>
        <NetworkSwitch network={network} selectNetwork={selectNetwork} />
      </YStack>

      <YStack alignItems="center" marginTop={20}>
        <Text>Current network: {network.name}</Text>
        <Text>Label: {currentAccount?.label}</Text>
        <Text>Address: {currentAccount?.address.pkh}</Text>
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
};
