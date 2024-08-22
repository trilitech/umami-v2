import { Button, Divider, Flex, Text, VStack } from "@chakra-ui/react";

import { StubIcon as WalletPlusIcon } from "../../../assets/icons";
import { IS_DEV } from "../../../env";
import { useColor } from "../../../styles/useColor";
import { OnboardWithFacebookButton } from "../../../views/Welcome/OnboardWithFacebookButton";
import { OnboardWithGoogleButton } from "../../../views/Welcome/OnboardWithGoogleButton";
import { OnboardWithRedditButton } from "../../../views/Welcome/OnboardWithRedditButton";
import { OnboardWithTwitterButton } from "../../../views/Welcome/OnboardWithTwitterButton";
import { ModalContentWrapper } from "../ModalContentWrapper";
import { type OnboardingStep } from "../OnboardingStep";

export const ConnectOrCreate = ({
  goToStep,
  closeModal,
}: {
  goToStep: (step: OnboardingStep) => void;
  closeModal: () => void;
}) => {
  const color = useColor();

  return (
    <ModalContentWrapper icon={<WalletPlusIcon />} title="Connect or Create Account">
      <VStack width="100%" spacing="16px">
        <Button width="100%" onClick={_ => goToStep({ type: "notice" })} size="lg">
          Create a new Account
        </Button>
        <Button
          width="100%"
          onClick={_ => goToStep({ type: "connectOptions" })}
          size="lg"
          variant="tertiary"
        >
          I already have a wallet
        </Button>
        {IS_DEV && (
          <Button
            width="100%"
            onClick={_ => goToStep({ type: "fakeAccount" })}
            size="lg"
            variant="tertiary"
          >
            Add a Fake Account
          </Button>
        )}
        <Flex width="100%" paddingTop="14px" paddingBottom="6px">
          <Divider marginTop="11px" />
          <Text minWidth="160px" color={color("400")} textAlign="center" noOfLines={1} size="sm">
            Continue with social
          </Text>
          <Divider marginTop="11px" />
        </Flex>
        <Flex gap="12px">
          <OnboardWithGoogleButton onAuth={closeModal} />
          <OnboardWithFacebookButton onAuth={closeModal} />
          <OnboardWithTwitterButton onAuth={closeModal} />
          {/* <OnboardWithEmailButton onAuth={closeModal} /> */}
          <OnboardWithRedditButton onAuth={closeModal} />
        </Flex>
      </VStack>
    </ModalContentWrapper>
  );
};
