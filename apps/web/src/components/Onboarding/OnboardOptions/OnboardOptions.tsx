import { Button, Center, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import { type PropsWithChildren } from "react";

import { OnboardWithFacebookButton } from "./OnboardWithFacebookButton";
import { OnboardWithGoogleButton } from "./OnboardWithGoogleButton";
import { OnboardWithRedditButton } from "./OnboardWithRedditButton";
import { OnboardWithTwitterButton } from "./OnboardWithTwitterButton";
import { useColor } from "../../../styles/useColor";
import { trackButtonClick } from "../../../utils/analytics";
import { AccountTileWrapper } from "../../AccountTile";
import { NameAccountModal } from "../../NameAccountModal";
import { ImportWallet } from "../ImportWallet";
import { SetupPassword } from "../SetupPassword";
import { useIsAccountVerified } from "../VerificationFlow";

export const OnboardOptions = ({ children }: PropsWithChildren) => {
  const color = useColor();
  const { openWith } = useDynamicModalContext();
  const isAccountVerified = useIsAccountVerified();

  const handleCreateNewWallet = () => {
    if (isAccountVerified) {
      return openWith(
        <NameAccountModal
          buttonLabel="Continue"
          onSubmit={() => openWith(<SetupPassword mode="add_account" />)}
          subtitle={"Name your account or edit your\n account name later."}
          title="Create Account"
          withAdvancedSettings
        />
      );
    } else {
      return openWith(<SetupPassword mode="new_mnemonic" />);
    }
  };

  return (
    <Flex alignItems="center" flexDirection="column" width="full">
      <Heading color={color("900")} size="lg">
        Continue with:
      </Heading>

      <Center flexDirection="column" gap="36px" width="full" height="full">
        <Flex gap={{ base: "24px", md: "30px" }} marginTop="30px" color={color("white", "black")}>
          <AccountTileWrapper>
            <OnboardWithGoogleButton />
          </AccountTileWrapper>

          <AccountTileWrapper>
            <OnboardWithFacebookButton />
          </AccountTileWrapper>

          <AccountTileWrapper>
            <OnboardWithTwitterButton />
          </AccountTileWrapper>

          <AccountTileWrapper>
            <OnboardWithRedditButton />
          </AccountTileWrapper>
        </Flex>

        <Center gap="4px" width="full">
          <Divider width="full" />
          <Text color={color("500")} size="lg">
            or
          </Text>
          <Divider width="full" />
        </Center>

        <Flex flexDirection="column" gap="12px" width="full">
          <Button
            width="full"
            onClick={() => {
              trackButtonClick("onboarding", "create_new_wallet");
              return handleCreateNewWallet();
            }}
            size="lg"
            variant="primary"
          >
            Create a new wallet
          </Button>
          <Button
            width="full"
            onClick={() => {
              trackButtonClick("onboarding", "use_existing_wallet");
              return openWith(<ImportWallet />, {
                size: "xl",
                variant: "onboarding",
              });
            }}
            size="lg"
            variant="secondary"
          >
            I already have a wallet
          </Button>
        </Flex>

        {children}
      </Center>
    </Flex>
  );
};
