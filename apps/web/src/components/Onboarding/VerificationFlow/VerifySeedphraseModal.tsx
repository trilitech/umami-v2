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
import { MnemonicAutocomplete, useDynamicModalContext } from "@umami/components";
import { selectRandomElements } from "@umami/core";
import { accountsActions, useAppDispatch, useCurrentAccount } from "@umami/state";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { KeyIcon } from "../../../assets/icons";
import { IS_DEV } from "../../../env";
import { useColor } from "../../../styles/useColor";
import { ModalBackButton } from "../../BackButton";
import { ModalCloseButton } from "../../CloseButton";

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
          <Icon as={KeyIcon} boxSize="24px" marginBottom="4px" color={color("blue")} />
          <Heading size="xl">Verify Seed Phrase</Heading>
          <Text width="full" color={color("700")} fontWeight="400" textAlign="center" size="md">
            To verify, please type in the word that corresponds to each sequence number.
          </Text>
        </Center>
      </ModalHeader>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <Flex gap="12px">
              {randomElements.map(({ index, value }) => {
                const inputName = `${index}`;
                const error = errors[inputName];

                return (
                  <FormControl key={index} isInvalid={!!error}>
                    <Flex key={index} alignItems="center">
                      <Text
                        position="absolute"
                        zIndex={1}
                        marginLeft={{ lg: "16px", base: "10px" }}
                        color={color("black")}
                        textAlign="right"
                        size={{ lg: "lg", base: "xs" }}
                      >
                        {String(index + 1).padStart(2, "0")}.
                      </Text>
                      <MnemonicAutocomplete
                        inputName={inputName}
                        inputProps={{
                          variant: "mnemonic",
                          placeholder: `word #${index + 1}`,
                        }}
                        listProps={{
                          marginTop: "6px",
                        }}
                        validate={_value => {
                          if (_value !== value) {
                            return "Word doesn't match";
                          }
                        }}
                      />
                    </Flex>
                    {error?.message && (
                      <FormErrorMessage>{(error as any).message}</FormErrorMessage>
                    )}
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
