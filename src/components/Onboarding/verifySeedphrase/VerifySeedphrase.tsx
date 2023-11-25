import { Input, Box, Button, FormControl, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { useState } from "react";
import ModalContentWrapper from "../ModalContentWrapper";
import { useForm } from "react-hook-form";
import { Step, StepType, VerifySeedphraseStep } from "../useOnboardingModal";
import { selectRandomElements } from "../../../utils/tezos/helpers";
import { FormErrorMessage } from "../../FormErrorMessage";
import DoubleCheckmarkIcon from "../../../assets/icons/DoubleCheckmark";

const VerifySeedphrase = ({
  goToStep,
  account,
}: {
  goToStep: (step: Step) => void;
  account: VerifySeedphraseStep["account"];
}) => {
  const seedphraseArray = account.mnemonic.split(" ");
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm({
    mode: "onBlur",
  });
  const [randomElements] = useState(selectRandomElements(seedphraseArray, 5));
  const onSubmit = () => {
    goToStep({ type: StepType.nameAccount, account });
  };
  return (
    <ModalContentWrapper
      icon={<DoubleCheckmarkIcon />}
      title="Verify Seed Phrase"
      subtitle="To verify, please type in the word that corresponds to each sequence number."
    >
      <Box overflowX="hidden" overflowY="auto" width="100%">
        <form onSubmit={handleSubmit(onSubmit)}>
          {randomElements.map((item, index) => {
            return (
              <FormControl
                key={index}
                marginBottom="12px"
                isInvalid={!!errors[`${item.index}`] && isDirty}
              >
                <InputGroup size="md">
                  <InputLeftElement data-testid="mnemonic-index">{item.index + 1}</InputLeftElement>
                  <Input
                    placeholder="Type here"
                    {...register(`${item.index}`, {
                      required: true,
                      validate: value => value === `${item.value}`,
                    })}
                  />
                </InputGroup>
                {errors[`${item.index}`] && <FormErrorMessage>Invalid input</FormErrorMessage>}
              </FormControl>
            );
          })}
          <Button width="100%" marginTop="20px" isDisabled={!isValid} size="lg" type="submit">
            Continue
          </Button>

          {
            /* devblock:start */
            <Button width="100%" marginTop="12px" onClick={onSubmit} size="lg">
              Bypass (Dev only)
            </Button>
            /* devblock:end */
          }
        </form>
      </Box>
    </ModalContentWrapper>
  );
};

export default VerifySeedphrase;
