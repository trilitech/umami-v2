import { ArrowDown, ArrowUpRight, Repeat, Wallet } from "@tamagui/lucide-icons";
import { useCurrentAccount, useSelectNetwork, useSelectedNetwork } from "@umami/state";
import { Button, Text, XStack, YStack } from "tamagui";

import { ActionButton, BalanceDisplay, NetworkSwitch } from "./components";
import { FormPage } from "../../components/SendFlow/Tez";
import { useModal } from "../../providers/ModalProvider";
import { useOnboardingAuth } from "../../services/auth";

export const Home = () => {
  const currentAccount = useCurrentAccount()!;
  const network = useSelectedNetwork();
  const selectNetwork = useSelectNetwork();
  const { logout } = useOnboardingAuth();
  const { showModal } = useModal();

  const address = currentAccount.address.pkh;

  const handleLogout = async () => {
    const idp = "idp" in currentAccount ? currentAccount.idp : undefined;
    await logout(idp);
  };

  return (
    <YStack alignItems="center" flex={1} paddingTop={20} backgroundColor="white">
      <BalanceDisplay address={address} />
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
        <Text>Label: {currentAccount.label}</Text>
        <Text>Address: {address}</Text>
      </YStack>

      <Button marginTop={20} onPress={handleLogout} size="$4">
        Logout
      </Button>
    </YStack>
  );
};
