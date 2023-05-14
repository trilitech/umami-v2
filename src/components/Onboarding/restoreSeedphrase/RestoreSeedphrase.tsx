import {
  VStack,
  Text,
  Input,
  Box,
  Button,
  GridItem,
  Grid,
  Select,
} from "@chakra-ui/react";
import { useState } from "react";
import { SupportedIcons } from "../../CircleIcon";
import ModalContentWrapper from "../ModalContentWrapper";
import { FieldValues, useForm } from "react-hook-form";
import { WarningIcon } from "@chakra-ui/icons";
import {
  Step,
  StepType,
  TemporaryMnemonicAccountConfig,
} from "../useOnboardingModal";

const RestoreSeedphrase = ({ setStep }: { setStep: (step: Step) => void }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [value, setValue] = useState("24");
  const onSubmit = (data: FieldValues) => {
    let seedphrase = "";
    for (const key in data) {
      seedphrase += data[key] + " ";
    }
    // TODO validate seedphrase
    const config: TemporaryMnemonicAccountConfig = { seedphrase };
    setStep({ type: StepType.verifySeedphrase, config });
  };
  return (
    <ModalContentWrapper
      icon={SupportedIcons.wallet}
      title="Import Seed Phrase"
      subtitle="Please fill in the Seed Phrase in sequence."
    >
      <Box overflow="scroll" w="100%">
        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <VStack w="100%" spacing={4}>
            <Select
              onChange={(event) => setValue(event.target.value)}
              value={value}
            >
              {[12, 15, 18, 24].map((value) => {
                return (
                  <option key={value} value={value}>
                    {value} Words
                  </option>
                );
              })}
            </Select>

            <Grid templateColumns="repeat(3, 1fr)" gap={3} pb="20px">
              {Array.from({ length: parseInt(value) }).map((item, index) => {
                return (
                  <GridItem
                    key={index}
                    fontSize="sm"
                    border="1px dashed #D6D6D6;"
                    borderRadius="4px"
                    p="6px"
                    display="flex"
                  >
                    <Text p="8px">{index + 1}</Text>
                    <Input
                      border="none"
                      placeholder="Type here"
                      {...register(`${index}`, {
                        required: true,
                      })}
                    />
                    {errors[`${index}`] && (
                      <WarningIcon p="8px" w={"40px"} h={"40px"} color="red" />
                    )}
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
            >
              Continue
            </Button>
          </VStack>
        </form>
      </Box>
    </ModalContentWrapper>
  );
};

export default RestoreSeedphrase;
