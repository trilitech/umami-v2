import { ArrowLeftCircle } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { SafeAreaView, TouchableOpacity } from "react-native";
import { Text, YStack } from "tamagui";

import {
  ButtonLabel,
  PrimaryButton,
  PrimaryButtonLabel,
  SecondaryButton,
} from "../Onboarding/onboardingStyles";

export const ImportWallet = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <YStack flex={1} paddingTop="$4" backgroundColor="white" paddingHorizontal="$4" space="$4">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeftCircle size="$2" />
        </TouchableOpacity>

        <YStack flex={1}>
          <Text fontSize="$8" fontWeight="bold">
            How would you like to import your wallet?
          </Text>

          <YStack justifyContent="flex-end" flex={1} space="12px">
            <PrimaryButton onPress={() => router.push("/seed-phrase")}>
              <PrimaryButtonLabel>Seed Phrase</PrimaryButtonLabel>
            </PrimaryButton>
            <SecondaryButton>
              <ButtonLabel>Backup</ButtonLabel>
            </SecondaryButton>
            <SecondaryButton>
              <ButtonLabel>Secret Key</ButtonLabel>
            </SecondaryButton>
          </YStack>
        </YStack>
      </YStack>
    </SafeAreaView>
  );
};
