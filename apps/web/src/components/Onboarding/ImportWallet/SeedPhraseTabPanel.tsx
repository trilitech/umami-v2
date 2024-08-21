import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  TabPanel,
  Text,
} from "@chakra-ui/react";
import { MnemonicAutocomplete, useDynamicModalContext, useMultiForm } from "@umami/components";
import { useAsyncActionHandler } from "@umami/state";
import { range } from "lodash";
import { FormProvider, useFieldArray } from "react-hook-form";

import { CloseIcon } from "../../../assets/icons";
import { useColor } from "../../../styles/useColor";
import { RadioButtons } from "../../RadioButtons/RadioButtons";
import { SetupPassword } from "../SetupPassword";

const MNEMONIC_SIZE_OPTIONS = [12, 15, 18, 21, 24];

export const SeedPhraseTabPanel = () => {
  const color = useColor();
  const { handleAsyncAction } = useAsyncActionHandler();
  const form = useMultiForm<{ mnemonicSize: number; mnemonic: { val: string }[] }>({
    mode: "onBlur",
    defaultValues: {
      mnemonicSize: 24,
      mnemonic: range(24).map(() => ({ val: "" })),
    },
  });
  const { openWith } = useDynamicModalContext();

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
      remove(range(newSize - 1, mnemonicSize));
    }
  };

  const pasteMnemonic = (mnemonic: string) =>
    handleAsyncAction(async () => {
      const words = mnemonic.split(" ");
      if (!MNEMONIC_SIZE_OPTIONS.includes(words.length)) {
        throw new Error(`the mnemonic must be ${MNEMONIC_SIZE_OPTIONS.join(", ")} words long`);
      }
      words.slice(0, mnemonicSize).forEach((word, i) => update(i, { val: word }));
      return Promise.resolve();
    });

  return (
    <TabPanel>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(() => openWith(<SetupPassword type="mnemonic" />))}>
          <Flex flexDirection="column" gap="30px">
            <Accordion allowToggle>
              <AccordionItem>
                <AccordionButton justifyContent="center" gap="10px" color={color("900")}>
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

            <Grid gridRowGap="16px" gridColumnGap="12px" gridTemplateColumns="repeat(3, 1fr)">
              {fields.map((field, index) => (
                <GridItem key={field.id}>
                  <Text
                    position="absolute"
                    zIndex={1}
                    marginTop={{ lg: "10px", base: "8px" }}
                    marginLeft={{ lg: "16px", base: "10px" }}
                    color={color("white", "black")}
                    textAlign="right"
                    size={{ lg: "lg", base: "xs" }}
                  >
                    {String(index + 1).padStart(2, "0")}.
                  </Text>
                  <MnemonicAutocomplete
                    inputName={`mnemonic.${index}.val`}
                    inputProps={{
                      ...register(`mnemonic.${index}.val`, { required: true }),
                      // eslint-disable-next-line @typescript-eslint/no-misused-promises
                      onPaste: async e => {
                        e.preventDefault();
                        return pasteMnemonic(e.clipboardData.getData("text/plain"));
                      },
                      variant: "mnemonic",
                      placeholder: `word #${index + 1}`,
                    }}
                  />
                </GridItem>
              ))}
            </Grid>
            <Button gap="4px" onClick={() => form.resetField("mnemonic")} variant="ghost">
              <Icon as={CloseIcon} />
              Clear All
            </Button>
            <Button isDisabled={!isValid} type="submit" variant="primary">
              Next
            </Button>
          </Flex>
        </form>
      </FormProvider>
    </TabPanel>
  );
};
