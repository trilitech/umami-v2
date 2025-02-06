import { ClipboardPaste, Trash2 } from "@tamagui/lucide-icons";
import { CustomError } from "@umami/utils";
import { validateMnemonic } from "bip39";
import * as Clipboard from "expo-clipboard";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { SafeAreaView } from "react-native";
import { Button, Text, XStack, YStack } from "tamagui";

import { ButtonLabel, PrimaryButton, PrimaryButtonLabel } from "../Onboarding/onboardingStyles";
import { MnemonicGrid } from "./components/MnemonicGrid";
import { MnemonicPasswordModal } from "./components/MnemonicPasswordModal";
import { useModal } from "../../providers/ModalProvider";

type FormValues = {
  mnemonic: { val: string }[];
};

const MNEMONIC_SIZE = 24;

export const SeedPhrase = () => {
  const { showModal } = useModal();
  const form = useForm<FormValues>({
    mode: "onBlur",
    defaultValues: {
      mnemonic: Array(24).fill({ val: "" }),
    },
  });

  const { handleSubmit } = form;

  const { fields, update } = useFieldArray({
    control: form.control,
    name: "mnemonic",
    rules: { required: true, minLength: 12, maxLength: 24 },
  });

  const pasteMnemonic = async () => {
    const mnemonic = await Clipboard.getStringAsync();
    const words = mnemonic.split(" ");

    if (words.length > MNEMONIC_SIZE) {
      throw new CustomError(`the mnemonic must be ${MNEMONIC_SIZE} words long`);
    }

    words.forEach((word, i) => update(i, { val: word }));
  };

  const onSubmit = ({ mnemonic }: FormValues) => {
    if (!validateMnemonic(mnemonic.map(({ val }) => val).join(" "))) {
      throw new CustomError("Invalid Mnemonic");
    }
    showModal(<MnemonicPasswordModal mnemonic={mnemonic} />, {
      snapPoints: [40],
    });
  };

  const clearAll = () => form.setValue("mnemonic", Array(MNEMONIC_SIZE).fill({ val: "" }));

  return (
    <FormProvider {...form}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <YStack flex={1} paddingHorizontal="$4" space="$6">
          <YStack paddingTop="$6">
            <Text paddingBottom="$4" fontSize="$8" fontWeight="bold">
              Seed Phrase
            </Text>
            <Text paddingBottom="$2" color="$gray11">
              Enter your seed phrase to import wallet.
            </Text>
            <Text color="$blue10" fontSize="$3" onPress={() => {}}>
              Where can I find this?
            </Text>
          </YStack>
          <YStack justifyContent="center" flex={1}>
            <MnemonicGrid fields={fields} />
          </YStack>
          <YStack justifyContent="flex-end" flex={1} paddingBottom="$5">
            <XStack justifyContent="space-between" gap="$2">
              <Button
                flex={1}
                height={48}
                borderRadius="$10"
                icon={<ClipboardPaste size={24} />}
                onPress={pasteMnemonic}
                variant="outlined"
              >
                <ButtonLabel>Paste</ButtonLabel>
              </Button>
              <Button
                flex={1}
                height={48}
                borderRadius="$10"
                icon={<Trash2 size={24} />}
                onPress={clearAll}
                variant="outlined"
              >
                <ButtonLabel>Clear</ButtonLabel>
              </Button>
            </XStack>
            <PrimaryButton onPress={handleSubmit(onSubmit)}>
              <PrimaryButtonLabel>Import</PrimaryButtonLabel>
            </PrimaryButton>
          </YStack>
        </YStack>
      </SafeAreaView>
    </FormProvider>
  );
};
