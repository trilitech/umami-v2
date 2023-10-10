import { Checkbox, Button, Link } from "@chakra-ui/react";
import React from "react";
import { SupportedIcons } from "../../CircleIcon";
import ModalContentWrapper from "../ModalContentWrapper";
import { Step, StepType } from "../useOnboardingModal";

const Eula: React.FC<{
  goToStep: (step: Step) => void;
}> = ({ goToStep }) => {
  const [isChecked, setIsChecked] = React.useState(false);
  return (
    <ModalContentWrapper icon={SupportedIcons.document} title="Accept to Continue">
      <>
        <Checkbox
          onChange={e => setIsChecked(e.target.checked)}
          pt="20px"
          pb="24px"
          fontWeight="600"
        >
          I confirm that I have read and agreed with the{" "}
          <Link
            textDecoration="underline"
            target="_blank"
            rel="noreferrer"
            href="https://umamiwallet.com/tos.html"
          >
            Terms of Service
          </Link>{" "}
          and the{" "}
          <Link
            textDecoration="underline"
            target="_blank"
            rel="noreferrer"
            href="https://umamiwallet.com/privacypolicy.html"
          >
            Privacy Policy
          </Link>
        </Checkbox>
        <Button
          w="100%"
          size="lg"
          isDisabled={!isChecked}
          onClick={() => {
            goToStep({ type: StepType.connectOrCreate });
          }}
        >
          Continue
        </Button>
      </>
    </ModalContentWrapper>
  );
};

export default Eula;
