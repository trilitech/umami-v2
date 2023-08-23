import { VStack, Text, Input, Box, Button, GridItem, Grid, Select } from "@chakra-ui/react";
import { useState } from "react";
import { SupportedIcons } from "../../CircleIcon";
import ModalContentWrapper from "../ModalContentWrapper";
import { FieldValues, useForm } from "react-hook-form";
import { WarningIcon } from "@chakra-ui/icons";
import { Step, StepType } from "../useOnboardingModal";
import { InMemorySigner } from "@taquito/signer";
import { mnemonic1 } from "../../../mocks/mockMnemonic";
import { useAsyncActionHandler } from "../../../utils/hooks/useAsyncActionHandler";

const RestoreSeedphrase = ({ goToStep }: { goToStep: (step: Step) => void }) => {
  const {
    register,
    handleSubmit,
    setValue: setFormValue,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    mode: "onBlur",
  });
  const { handleAsyncAction } = useAsyncActionHandler();
  //TODO: see if we could use useForm instead of the useState
  const [mnemonicSize, setMnemonicSize] = useState("12");

  const pasteMnemonic = (mnemonic: string, mnemonicSize: number) => {
    mnemonic
      .split(" ")
      .slice(0, mnemonicSize)
      .forEach((word, i) => {
        setFormValue(`word${i}`, word);
      });
    trigger();
  };

  const onSubmit = (data: FieldValues) =>
    handleAsyncAction(
      async () => {
        let seedphrase = "";
        for (const key in data) {
          seedphrase += data[key] + " ";
        }
        seedphrase = seedphrase.trim();

        // TODO: test this
        InMemorySigner.fromMnemonic({
          mnemonic: seedphrase,
          derivationPath: "44'/1729'/0'/0'",
          curve: "ed25519",
        });
        goToStep({
          type: StepType.derivationPath,
          account: { type: "mnemonic", seedphrase: seedphrase, label: "Restored account" },
        });
      },
      {
        title: "Invalid Mnemonic",
      }
    );
  return (
    <ModalContentWrapper
      icon={SupportedIcons.wallet}
      title="Import Seed Phrase"
      subtitle="Please fill in the Seed Phrase in sequence."
    >
      <Box overflowX="hidden" p="4px" w="100%">
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <VStack w="100%" spacing={4}>
            <Select
              data-testid="select"
              onChange={event => setMnemonicSize(event.target.value)}
              value={mnemonicSize}
            >
              {[12, 15, 18, 24].reverse().map(value => {
                return (
                  <option key={value} value={value}>
                    {value} Words
                  </option>
                );
              })}
            </Select>

            <Grid templateColumns="repeat(3, 1fr)" gap={3} pb="20px">
              {Array.from({ length: parseInt(mnemonicSize) }).map((_, index) => {
                return (
                  <GridItem
                    key={index}
                    fontSize="sm"
                    border="1px dashed #D6D6D6;"
                    borderRadius="4px"
                    p="6px"
                    display="flex"
                  >
                    <Text pl="8px" pr="8px">
                      {index + 1}
                    </Text>
                    <Input
                      onPaste={async e => {
                        e.preventDefault();
                        const mnemonic = await navigator.clipboard.readText();
                        pasteMnemonic(mnemonic, parseInt(mnemonicSize));
                      }}
                      size="xsmall"
                      border="none"
                      placeholder="Type here"
                      {...register(`word${index}`, {
                        required: true,
                      })}
                    />
                    {errors[`${index}`] && <WarningIcon p="8px" w="40px" h="40px" color="red" />}
                  </GridItem>
                );
              })}
            </Grid>
            <Button
              type="submit"
              bg="umami.blue"
              w="100%"
              size="lg"
              minH="48px"
              isDisabled={!isValid}
            >
              Continue
            </Button>

            {
              /* devblock:start */
              <Button
                onClick={() => {
                  setMnemonicSize("24");
                  pasteMnemonic(mnemonic1, mnemonic1.split(" ").length);
                }}
                bg="umami.blue"
                w="100%"
                size="lg"
                minH="48px"
              >
                Enter test seedphrase (Dev only)
              </Button>
              /* devblock:end */
            }
          </VStack>
        </form>
      </Box>
    </ModalContentWrapper>
  );
};

export default RestoreSeedphrase;
