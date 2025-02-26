import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Center,
  Flex,
  Grid,
  Heading,
  Icon,
  type InputProps,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useDynamicModalContext, useMultiForm, useToggleMnemonic } from "@umami/components";
import { useAsyncActionHandler } from "@umami/state";
import { CustomError } from "@umami/utils";
import { validateMnemonic } from "bip39";
import { range } from "lodash";
import { useState } from "react";
import { FormProvider, useFieldArray } from "react-hook-form";

import { CloseIcon, EyeIcon, EyeOffIcon, PasteIcon } from "../../../assets/icons";
import { useColor } from "../../../styles/useColor";
import { trackOnboardingEvent } from "../../../utils/analytics";
import { MnemonicWord } from "../../MnemonicWord";
import { RadioButtons } from "../../RadioButtons";
import { SetupPassword } from "../SetupPassword";

const MNEMONIC_SIZE_OPTIONS = [12, 15, 18, 21, 24];
const MNEMONIC_SIZE_MAX = 24;

type FormValues = {
  mnemonicSize: number;
  mnemonic: { val: string }[];
};

const getEmptyValue = (mnemonicSize: number) => range(mnemonicSize).map(() => ({ val: "" }));

export const SeedPhraseTab = () => {
  const color = useColor();
  const { handleAsyncAction, isLoading } = useAsyncActionHandler();
  const form = useMultiForm<FormValues>({
    mode: "onBlur",
    defaultValues: {
      mnemonicSize: MNEMONIC_SIZE_MAX,
      mnemonic: getEmptyValue(MNEMONIC_SIZE_MAX),
    },
  });
  const { openWith } = useDynamicModalContext();
  const [showBlur, setShowBlur] = useState(true);
  const { isVisible, toggleMnemonic } = useToggleMnemonic();
  const [expandedIndex, setExpandedIndex] = useState<number | number[]>(-1);

  const {
    handleSubmit,
    register,
    control,
    formState: { isValid },
  } = form;

  const { fields, remove, append, update } = useFieldArray({
    control,
    name: "mnemonic",
    rules: { required: true, minLength: 12, maxLength: MNEMONIC_SIZE_MAX },
  });

  const mnemonicSize = form.watch("mnemonicSize");

  const changeMnemonicSize = (newSize: number) => {
    if (newSize > mnemonicSize) {
      append(range(mnemonicSize, newSize).map(() => ({ val: "" })));
    } else {
      remove(range(newSize, mnemonicSize));
    }

    // change the accordion for the seed phrase size
    form.setValue("mnemonicSize", newSize);

    // Close the accordion
    setExpandedIndex(-1);
  };

  const pasteMnemonic = (mnemonic: string) =>
    handleAsyncAction(async () => {
      const words = mnemonic.trim().split(" "); // trim here. otherwise the last word is ''

      if (!MNEMONIC_SIZE_OPTIONS.includes(words.length)) {
        throw new CustomError(
          `the mnemonic must be ${MNEMONIC_SIZE_OPTIONS.join(", ")} words long`
        );
      }

      if (words.length !== mnemonicSize) {
        changeMnemonicSize(words.length);
      }

      words.forEach((word, i) => update(i, { val: word.trim() }));
      return Promise.resolve();
    });

  const onSubmit = ({ mnemonic }: FormValues) =>
    handleAsyncAction(async () => {
      if (!validateMnemonic(mnemonic.map(({ val }) => val).join(" "))) {
        throw new CustomError("Invalid Mnemonic");
      }

      trackOnboardingEvent("proceed_with_mnemonic");
      return openWith(<SetupPassword mode="mnemonic" />);
    });

  const clearAll = () => form.setValue("mnemonic", getEmptyValue(mnemonicSize));

  const onPaste: InputProps["onPaste"] = event => {
    event.preventDefault();
    void pasteMnemonic(event.clipboardData.getData("text/plain"));
    return;
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        void pasteMnemonic(text);
      }
    } catch (error) {
      console.error("Failed to read clipboard:", error);
    }
  };

  const indexProps = {
    fontSize: { base: "12px", md: "14px" },
  };

  const lastRowSize = useBreakpointValue({ md: fields.length % 4 }) || 0;

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex flexDirection="column">
          <Accordion allowToggle index={expandedIndex} onChange={setExpandedIndex}>
            <AccordionItem>
              <AccordionButton
                justifyContent="center"
                gap="10px"
                color={color("900")}
                borderBottom="1px solid"
                borderBottomColor={color("100")}
                _expanded={{ borderBottomColor: "transparent" }}
              >
                <Heading size="md">{mnemonicSize} word seed phrase</Heading>
                <AccordionIcon />
              </AccordionButton>

              <AccordionPanel>
                <Flex gap="8px">
                  <RadioButtons
                    inputName="mnemonicSize"
                    onSelect={changeMnemonicSize}
                    options={MNEMONIC_SIZE_OPTIONS}
                  />
                </Flex>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

          <Grid
            position="relative"
            gridRowGap="8px"
            gridColumnGap="8px"
            gridTemplateColumns={{ base: "repeat(3, 1fr)", md: "repeat(4, 1fr)" }}
            marginTop="36px"
          >
            {showBlur && (
              <Flex
                position="absolute"
                zIndex={2}
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                justifySelf="center"
                alignSelf="center"
                gap="4px"
                width="105%"
                height="105%"
                cursor="pointer"
                backdropFilter="blur(5px)"
                onClick={() => setShowBlur(false)}
              >
                <Text color={color("900")} fontSize="16px">
                  Be sure no one is looking
                </Text>
                <Text color={color("700")} fontSize="14px">
                  Click to proceed
                </Text>
              </Flex>
            )}

            {fields.slice(0, mnemonicSize - lastRowSize).map((field, index) => (
              <MnemonicWord
                key={field.id}
                autocompleteProps={{
                  inputName: `mnemonic.${index}.val`,
                  inputProps: {
                    ...register(`mnemonic.${index}.val`, { required: true }),
                    onPaste,
                    variant: "mnemonic",
                    placeholder: `word #${index + 1}`,
                    height: "40px",
                    type: isVisible ? "text" : "password",
                  },
                }}
                index={index}
                indexProps={indexProps}
              />
            ))}
          </Grid>

          <Center gap="8px" marginTop="16px">
            {fields.slice(fields.length - lastRowSize).map((field, offsetIndex) => {
              const index = fields.length - lastRowSize + offsetIndex;

              return (
                <MnemonicWord
                  key={field.id}
                  maxWidth="114px"
                  autocompleteProps={{
                    inputName: `mnemonic.${index}.val`,
                    inputProps: {
                      ...register(`mnemonic.${index}.val`, { required: true }),
                      onPaste,
                      variant: "mnemonic",
                      placeholder: `word #${index + 1}`,
                      height: "40px",
                      type: isVisible ? "text" : "password",
                    },
                  }}
                  index={index}
                  indexProps={indexProps}
                />
              );
            })}
          </Center>

          <Flex flexWrap="nowrap" gap="8px" marginTop="12px">
            <Button
              gap="8px"
              width="full"
              fontSize="14px"
              data-testid="paste-button"
              isDisabled={showBlur}
              onClick={handlePaste}
              variant="ghost"
            >
              <Icon as={PasteIcon} boxSize="18px" color={color("400")} />
              Paste
            </Button>
            <Button
              gap="8px"
              width="full"
              fontSize="14px"
              isDisabled={showBlur}
              onClick={toggleMnemonic}
              variant="ghost"
            >
              <Icon as={isVisible ? EyeOffIcon : EyeIcon} boxSize="18px" color={color("400")} />
              {isVisible ? "Hide" : "Show"}
            </Button>
            <Button
              gap="8px"
              width="full"
              fontSize="14px"
              isDisabled={showBlur}
              onClick={clearAll}
              variant="ghost"
            >
              <Icon as={CloseIcon} boxSize="18px" color={color("400")} />
              Clear
            </Button>
          </Flex>

          <Button
            marginTop="12px"
            isDisabled={!isValid}
            isLoading={isLoading}
            type="submit"
            variant="primary"
          >
            Next
          </Button>
        </Flex>
      </form>
    </FormProvider>
  );
};
