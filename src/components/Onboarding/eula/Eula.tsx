import { Checkbox, Button, Link } from "@chakra-ui/react";
import React from "react";
import ModalContentWrapper from "../ModalContentWrapper";
import { Step, StepType } from "../useOnboardingModal";
import DocumentIcon from "../../../assets/icons/Document";

const Eula: React.FC<{
  goToStep: (step: Step) => void;
}> = ({ goToStep }) => {
  const [isChecked, setIsChecked] = React.useState(false);
  return (
    <ModalContentWrapper icon={<DocumentIcon />} title="Accept to Continue">
      <>
        <Checkbox
          paddingBottom="24px"
          fontWeight="600"
          onChange={e => setIsChecked(e.target.checked)}
        >
          I confirm that I have read and agreed with the{" "}
          <Link
            textDecoration="underline"
            href="https://umamiwallet.com/tos.html"
            rel="noopener noreferrer"
            target="_blank"
          >
            Terms of Service
          </Link>{" "}
          and the{" "}
          <Link
            textDecoration="underline"
            href="https://umamiwallet.com/privacypolicy.html"
            rel="noopener noreferrer"
            target="_blank"
          >
            Privacy Policy
          </Link>
        </Checkbox>
        <Button
          width="100%"
          isDisabled={!isChecked}
          onClick={() => {
            goToStep({ type: StepType.connectOrCreate });
          }}
          size="lg"
        >
          Continue
        </Button>
      </>
    </ModalContentWrapper>
  );
};

export default Eula;
