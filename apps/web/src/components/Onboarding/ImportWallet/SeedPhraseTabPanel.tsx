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
import { MnemonicAutocomplete } from "@umami/components";
import { useAsyncActionHandler } from "@umami/state";
import { range } from "lodash";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { CloseIcon } from "../../../assets/icons";
import { useColor } from "../../../styles/useColor";

const MNEMONIC_SIZE_OPTIONS = [12, 15, 18, 21, 24];

export const SeedPhraseTabPanel = () => {
  const color = useColor();
  const [mnemonicSize, setMnemonicSize] = useState(24);
  const { handleAsyncAction } = useAsyncActionHandler();
  const form = useForm({
    mode: "onBlur",
  });

  const {
    handleSubmit,
    setValue,
    trigger,
    formState: { isValid },
  } = form;

  const changeMnemonicSize = (size: number) => {
    if (!MNEMONIC_SIZE_OPTIONS.includes(size)) {
      return;
    }

    setMnemonicSize(prevSize => {
      // If the users reduces the size, we will trim the words down to the new size
      if (prevSize > size) {
        range(size, Math.max(...MNEMONIC_SIZE_OPTIONS)).forEach(index =>
          setValue(`word${index}`, undefined)
        );
      }

      return size;
    });
    return trigger();
  };

  const pasteMnemonic = (mnemonic: string) =>
    handleAsyncAction(async () => {
      const words = mnemonic.split(" ");
      if (!MNEMONIC_SIZE_OPTIONS.includes(words.length)) {
        throw new Error(`the mnemonic must be ${MNEMONIC_SIZE_OPTIONS.join(", ")} words long`);
      }
      words.slice(0, mnemonicSize).forEach((word, i) => setValue(`word${i}`, word));
      return trigger();
    });

  return (
    <TabPanel>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(() => {})}>
          <Flex flexDirection="column" gap="30px">
            <Accordion allowToggle>
              <AccordionItem>
                <AccordionButton justifyContent="center" gap="10px" color={color("900")}>
                  <Heading size="md">{mnemonicSize} word seed phrase</Heading>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  <Flex gap="8px">
                    {MNEMONIC_SIZE_OPTIONS.map(size => {
                      const isSelected = size === mnemonicSize;
                      return (
                        <Button
                          key={size}
                          width="full"
                          borderColor={color("100")}
                          borderRadius="4px"
                          onClick={() => changeMnemonicSize(size)}
                          variant={isSelected ? "solid" : "outline"}
                        >
                          {size}
                        </Button>
                      );
                    })}
                  </Flex>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>

            <Grid gridRowGap="16px" gridColumnGap="12px" gridTemplateColumns="repeat(3, 1fr)">
              {range(mnemonicSize).map(index => (
                <GridItem key={index}>
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
                    inputName={`word${index}`}
                    inputProps={{
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
            <Button gap="4px" onClick={() => form.reset()} variant="ghost">
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
