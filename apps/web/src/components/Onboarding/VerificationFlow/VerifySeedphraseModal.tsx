import {
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Icon,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import { selectRandomElements } from "@umami/core";
import { accountsActions, useAppDispatch, useCurrentAccount } from "@umami/state";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { KeyIcon } from "../../../assets/icons";
import { IS_DEV } from "../../../env";
import { useColor } from "../../../styles/useColor";
import { ModalBackButton } from "../../BackButton";
import { ModalCloseButton } from "../../CloseButton";
import { MnemonicWord } from "../../MnemonicWord";

type VerifySeedphraseModalProps = {
  seedPhrase: string;
};

export const VerifySeedphraseModal = ({ seedPhrase }: VerifySeedphraseModalProps) => {
  const color = useColor();
  const dispatch = useAppDispatch();
  const currentAccount = useCurrentAccount()!;
  const { onClose } = useDynamicModalContext();
  const form = useForm({
    mode: "onBlur",
    defaultValues: {
      word1: "",
      word2: "",
      word3: "",
    },
  });
  const {
    handleSubmit,
    formState: { errors, isValid },
  } = form;

  const seedphraseArray = seedPhrase.split(" ");
  const [randomElements] = useState(selectRandomElements(seedphraseArray, 3));

  const onSubmit = () => {
    dispatch(
      accountsActions.setIsVerified({
        pkh: currentAccount.address.pkh,
        isVerified: true,
      })
    );

    dispatch(accountsActions.setPassword(""));

    onClose();
  };

  return (
    <ModalContent>
      <ModalHeader>
        <ModalBackButton />
        <ModalCloseButton />
        <Center flexDirection="column" gap="12px">
          <Icon as={KeyIcon} boxSize="24px" marginBottom="4px" color={color("400")} />
          <Heading size="xl">Verify Seed Phrase</Heading>
          <Text width="full" color={color("700")} fontWeight="400" textAlign="center" size="md">
            To verify, please type in the word that corresponds to each sequence number.
          </Text>
        </Center>
      </ModalHeader>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <Flex gap={{ base: "6px", md: "12px" }} userSelect="none">
              {randomElements.map(({ index, value }) => {
                const inputName = `word${index + 1}`;
                const error = errors[inputName as keyof typeof errors];

                return (
                  <FormControl key={index} isInvalid={!!error}>
                    <MnemonicWord
                      autocompleteProps={{
                        inputName,
                        inputProps: {
                          variant: "mnemonic",
                          placeholder: `word #${index + 1}`,
                          fontSize: { base: "12px", md: "18px" },
                          paddingLeft: { base: "36px", md: "46px" },
                          height: "48px",
                        },
                        listProps: {
                          marginTop: "6px",
                        },
                        validate: _value => {
                          if (_value !== value) {
                            return "Word doesn't match";
                          }
                        },
                      }}
                      index={index}
                      indexProps={{
                        fontSize: { base: "12px", md: "18px" },
                      }}
                    />
                    {error?.message && <FormErrorMessage>{error.message}</FormErrorMessage>}
                  </FormControl>
                );
              })}
            </Flex>
          </ModalBody>
          <ModalFooter flexDirection="column">
            <Button width="full" isDisabled={!isValid} type="submit" variant="primary">
              Verify
            </Button>

            {IS_DEV && (
              <Button width="100%" marginTop="12px" onClick={onSubmit} variant="secondary">
                Bypass (Dev only)
              </Button>
            )}
          </ModalFooter>
        </form>
      </FormProvider>
    </ModalContent>
  );
};
