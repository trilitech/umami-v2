import { Button, Center, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import { type PropsWithChildren } from "react";

import { OnboardWithFacebookButton } from "./OnboardWithFacebookButton";
import { OnboardWithGoogleButton } from "./OnboardWithGoogleButton";
import { OnboardWithRedditButton } from "./OnboardWithRedditButton";
import { OnboardWithTwitterButton } from "./OnboardWithTwitterButton";
import { useColor } from "../../../styles/useColor";
import { AccountTileWrapper } from "../../AccountTile";
import { ImportWallet } from "../ImportWallet";
import { SetupPassword } from "../SetupPassword";

export const OnboardOptions = ({ children }: PropsWithChildren) => {
  const color = useColor();

  const { openWith } = useDynamicModalContext();

  return (
    <Flex alignItems="center" flexDirection="column" width="full">
      <Heading color={color("900")} size="lg">
        Continue with:
      </Heading>

      <Center flexDirection="column" gap="36px" width="full" height="full">
        <Flex gap={{ base: "24px", lg: "30px" }} marginTop="30px" color={color("white", "black")}>
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
            onClick={() => openWith(<SetupPassword mode="new_mnemonic" />)}
            size="lg"
            variant="primary"
          >
            Create a new wallet
          </Button>
          <Button
            width="full"
            onClick={() =>
              openWith(<ImportWallet />, {
                size: "xl",
                variant: "onboarding",
              })
            }
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
