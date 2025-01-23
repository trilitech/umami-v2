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

import { CloseIcon, EyeIcon, EyeOffIcon } from "../../../assets/icons";
import { useColor } from "../../../styles/useColor";
import { MnemonicWord } from "../../MnemonicWord";
import { RadioButtons } from "../../RadioButtons";
import { SetupPassword } from "../SetupPassword";

const MNEMONIC_SIZE_OPTIONS = [12, 15, 18, 21, 24];

type FormValues = {
  mnemonicSize: number;
  mnemonic: { val: string }[];
};

export const SeedPhraseTab = () => {
  const color = useColor();
  const { handleAsyncAction, isLoading } = useAsyncActionHandler();
  const form = useMultiForm<FormValues>({
    mode: "onBlur",
    defaultValues: {
      mnemonicSize: 24,
      mnemonic: range(24).map(() => ({ val: "" })),
    },
  });
  const { openWith } = useDynamicModalContext();
  const [showBlur, setShowBlur] = useState(true);
  const { isVisible, toggleMnemonic } = useToggleMnemonic();

  const {
    handleSubmit,
    register,
    control,
    formState: { isValid },
  } = form;

  const { fields, remove, append, update } = useFieldArray({
    control,
    name: "mnemonic",
    rules: { required: true, minLength: 12, maxLength: 24 },
  });

  const mnemonicSize = form.watch("mnemonicSize");

  const changeMnemonicSize = (newSize: number) => {
    if (newSize > mnemonicSize) {
      append(range(mnemonicSize, newSize).map(() => ({ val: "" })));
    } else {
      remove(range(newSize, mnemonicSize));
    }
  };

  const pasteMnemonic = (mnemonic: string) =>
    handleAsyncAction(async () => {
      const words = mnemonic.split(" ");
      if (!MNEMONIC_SIZE_OPTIONS.includes(words.length)) {
        throw new CustomError(
          `the mnemonic must be ${MNEMONIC_SIZE_OPTIONS.join(", ")} words long`
        );
      }
      words.slice(0, mnemonicSize).forEach((word, i) => update(i, { val: word }));
      return Promise.resolve();
    });

  const onSubmit = ({ mnemonic }: FormValues) =>
    handleAsyncAction(async () => {
      if (!validateMnemonic(mnemonic.map(({ val }) => val).join(" "))) {
        throw new CustomError("Invalid Mnemonic");
      }
      return openWith(<SetupPassword mode="mnemonic" />);
    });

  const clearAll = () =>
    form.setValue(
      "mnemonic",
      range(mnemonicSize).map(() => ({ val: "" }))
    );

  const lastRowSize = useBreakpointValue({ md: fields.length % 4 }) || 0;

  const onPaste: InputProps["onPaste"] = event => {
    event.preventDefault();
    void pasteMnemonic(event.clipboardData.getData("text/plain"));
    return;
  };

  const indexProps = {
    fontSize: { base: "12px", md: "14px" },
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex flexDirection="column">
          <Accordion allowToggle>
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
            gridRowGap="16px"
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
            {fields.slice(0, fields.length - lastRowSize).map((field, index) => (
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

          <Flex gap="8px">
            <Button
              gap="8px"
              width="full"
              marginTop="16px"
              fontSize="14px"
              isDisabled={showBlur}
              onClick={clearAll}
              variant="ghost"
            >
              <Icon as={CloseIcon} boxSize="18px" color={color("400")} />
              Clear all
            </Button>
            <Button
              gap="8px"
              width="full"
              marginTop="16px"
              fontSize="14px"
              isDisabled={showBlur}
              onClick={toggleMnemonic}
              variant="ghost"
            >
              <Icon as={isVisible ? EyeOffIcon : EyeIcon} boxSize="18px" color={color("400")} />
              {isVisible ? "Hide phrase" : "Show phrase"}
            </Button>
          </Flex>

          <Button
            marginTop="30px"
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
