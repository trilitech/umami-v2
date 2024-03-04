import { Button, Checkbox, Link } from "@chakra-ui/react";
import React from "react";

import { DocumentIcon } from "../../../assets/icons";
import colors from "../../../style/colors";
import { ModalContentWrapper } from "../ModalContentWrapper";
import { OnboardingStep } from "../OnboardingStep";

export const Eula: React.FC<{
  goToStep: (step: OnboardingStep) => void;
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
            _hover={{ color: colors.green }}
            href="https://umamiwallet.com/tos.html"
            rel="noopener noreferrer"
            target="_blank"
          >
            Terms of Service
          </Link>{" "}
          and the{" "}
          <Link
            textDecoration="underline"
            _hover={{ color: colors.green }}
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
            goToStep({ type: "connectOrCreate" });
          }}
          size="lg"
        >
          Continue
        </Button>
      </>
    </ModalContentWrapper>
  );
};
