import { VStack, Input, Box, Button, GridItem, Grid, Select, Heading } from "@chakra-ui/react";
import { useState } from "react";
import { ModalContentWrapper } from "../ModalContentWrapper";
import { FieldValues, useForm } from "react-hook-form";
import { ChevronDownIcon, WarningIcon } from "@chakra-ui/icons";
import { Step, StepType } from "../useOnboardingModal";
import { mnemonic1 } from "../../../mocks/mockMnemonic";
import { useAsyncActionHandler } from "../../../utils/hooks/useAsyncActionHandler";
import { range } from "lodash";
import { validateMnemonic } from "bip39";
import { KeyIcon } from "../../../assets/icons";
import colors from "../../../style/colors";

const mnemonicSizes = [12, 15, 18, 24];

export const RestoreMnemonic = ({ goToStep }: { goToStep: (step: Step) => void }) => {
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
  const [mnemonicSize, setMnemonicSize] = useState(24);

  const handleMnemonicSizeChange = (value: string) => {
    const size = Number(value);
    if (!mnemonicSizes.includes(size)) {
      return;
    }

    setMnemonicSize(prevSize => {
      // If the users reduces the size, we will trim the words down to the new size
      if (prevSize > size) {
        range(size, Math.max(...mnemonicSizes)).forEach(index => {
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
      if (!mnemonicSizes.includes(words.length)) {
        throw new Error(`the mnemonic must be ${mnemonicSizes.join(", ")} words long`);
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
          throw new Error(`"${mnemonic}" is not a valid mnemonic`);
        }
        goToStep({
          type: StepType.nameAccount,
          account: { type: "mnemonic", mnemonic: mnemonic },
        });
      },
      {
        title: "Invalid Mnemonic",
      }
    );
  return (
    <ModalContentWrapper
      icon={<KeyIcon width="24px" height="24px" stroke={colors.gray[450]} />}
      subtitle="Please fill in the Seed Phrase in sequence."
      title="Import Seed Phrase"
    >
      <Box overflowX="hidden">
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <VStack width="100%" spacing={4}>
            <Select
              height="48px"
              color={colors.gray[450]}
              data-testid="select"
              icon={<ChevronDownIcon />}
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

            <Grid gridGap={3} gridTemplateColumns="repeat(3, 1fr)" paddingBottom="20px">
              {range(mnemonicSize).map(index => {
                return (
                  <GridItem
                    key={index}
                    display="flex"
                    height="38px"
                    padding="4px"
                    fontSize="sm"
                    background={colors.gray[800]}
                    border="1px solid"
                    borderColor={colors.gray[500]}
                    borderRadius="4px"
                  >
                    <Heading
                      width="18px"
                      marginRight="6px"
                      paddingTop="6px"
                      color={colors.gray[400]}
                      textAlign="right"
                      size="sm"
                    >
                      {index + 1}
                    </Heading>
                    <Input
                      border="none"
                      autoComplete="off"
                      onPaste={async e => {
                        e.preventDefault();
                        const mnemonic = await navigator.clipboard.readText();
                        pasteMnemonic(mnemonic);
                      }}
                      placeholder="Type here..."
                      size="xsmall"
                      {...register(`word${index}`, {
                        required: true,
                      })}
                    />
                    {errors[`${index}`] && (
                      <WarningIcon width="40px" height="40px" padding="8px" color="red" />
                    )}
                  </GridItem>
                );
              })}
            </Grid>
            <Button width="100%" isDisabled={!isValid} size="lg" type="submit">
              Continue
            </Button>

            {
              /* devblock:start */
              <Button
                width="100%"
                onClick={() => {
                  pasteMnemonic(mnemonic1);
                }}
                size="lg"
              >
                Enter test mnemonic (Dev only)
              </Button>
              /* devblock:end */
            }
          </VStack>
        </form>
      </Box>
    </ModalContentWrapper>
  );
};
