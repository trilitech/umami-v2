import { VStack, Text, Input, Box, Button, GridItem, Grid, Select } from "@chakra-ui/react";
import { useState } from "react";
import { SupportedIcons } from "../../CircleIcon";
import ModalContentWrapper from "../ModalContentWrapper";
import { FieldValues, useForm } from "react-hook-form";
import { WarningIcon } from "@chakra-ui/icons";
import { Step, StepType } from "../useOnboardingModal";
import { mnemonic1 } from "../../../mocks/mockMnemonic";
import { useAsyncActionHandler } from "../../../utils/hooks/useAsyncActionHandler";
import { range } from "lodash";
import { validateMnemonic } from "bip39";

type MnemonicSize = 12 | 15 | 18 | 24;
const mnemonicSizes: MnemonicSize[] = [12, 15, 18, 24];

const RestoreSeedphrase = ({ goToStep }: { goToStep: (step: Step) => void }) => {
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    mode: "onBlur",
  });
  const { handleAsyncAction } = useAsyncActionHandler();
  const [mnemonicSize, setMnemonicSize] = useState<MnemonicSize>(24);

  const handleMnemonicSizeChange = (value: string) => {
    const size = Number(value) as MnemonicSize;
    if (!mnemonicSizes.includes(size)) {
      return;
    }

    setMnemonicSize(prevSize => {
      // If the users reduces the size, we will trim the words down to the new size
      if (prevSize > size) {
        range(size, 24).forEach(index => {
          setValue(`word${index}`, undefined);
        });
      }

      return size;
    });
    trigger();
  };

  const pasteMnemonic = (mnemonic: string) =>
    handleAsyncAction(async () => {
      const words = mnemonic.split(" ");
      if (!mnemonicSizes.includes(words.length as MnemonicSize)) {
        throw new Error("the mnemonic must be 12, 15, 18 or 24 words long");
      }
      words.slice(0, mnemonicSize).forEach((word, i) => {
        setValue(`word${i}`, word);
      });
      trigger();
    });

  const onSubmit = (data: FieldValues) =>
    handleAsyncAction(
      async () => {
        const mnemonic = Object.values(data).join(" ").trim();
        if (!validateMnemonic(mnemonic)) {
          throw new Error(`"${mnemonic}" is not a valid mnemonic"`);
        }
        goToStep({
          type: StepType.derivationPath,
          account: { type: "mnemonic", seedphrase: mnemonic, label: "Restored account" },
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
              onChange={event => handleMnemonicSizeChange(event.target.value)}
              value={mnemonicSize}
            >
              {mnemonicSizes.reverse().map(value => {
                return (
                  <option key={value} value={value}>
                    {value} Words
                  </option>
                );
              })}
            </Select>

            <Grid templateColumns="repeat(3, 1fr)" gap={3} pb="20px">
              {range(mnemonicSize).map(index => {
                return (
                  <GridItem
                    key={index}
                    fontSize="sm"
                    border="1px dashed #D6D6D6;"
                    borderRadius="4px"
                    p="4px"
                    display="flex"
                  >
                    <Text p="1px" mr="1px">
                      {index + 1}
                    </Text>
                    <Input
                      autoComplete="off"
                      onPaste={async e => {
                        e.preventDefault();
                        const mnemonic = await navigator.clipboard.readText();
                        pasteMnemonic(mnemonic);
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
            <Button type="submit" w="100%" size="lg" isDisabled={!isValid}>
              Continue
            </Button>

            {
              /* devblock:start */
              <Button
                onClick={() => {
                  pasteMnemonic(mnemonic1);
                }}
                w="100%"
                size="lg"
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
