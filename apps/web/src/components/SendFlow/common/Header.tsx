import { AspectRatio, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { capitalize } from "lodash";

import { CodeSandboxIcon } from "../../../assets/icons";
import { useColor } from "../../../styles/useColor";
import { VerifyInfobox } from "../../WalletConnect/VerifyInfobox";
import { SignPageHeader } from "../SignPageHeader";
import { type SignHeaderProps } from "../utils";

export const Header = ({ headerProps }: { headerProps: SignHeaderProps }) => {
  const color = useColor();

  return (
    <>
      <SignPageHeader>
        <Flex alignItems="center" justifyContent="center" marginTop="10px">
          <Heading marginRight="4px" color={color("700")} size="sm">
            Network:
          </Heading>
          <Text color={color("700")} fontWeight="400" size="sm">
            {capitalize(headerProps.network.name)}
          </Text>
        </Flex>

        <Flex
          alignItems="center"
          marginTop="16px"
          padding="15px"
          borderRadius="4px"
          backgroundColor={color("100")}
        >
          <AspectRatio width="30px" marginRight="12px" ratio={1}>
            <Image
              borderRadius="4px"
              objectFit="cover"
              fallback={<CodeSandboxIcon width="36px" height="36px" />}
              src={headerProps.appIcon}
            />
          </AspectRatio>
          <Heading size="sm">{headerProps.appName}</Heading>
        </Flex>
      </SignPageHeader>
      {headerProps.requestId.sdkType === "walletconnect" ? (
        <VerifyInfobox
          isScam={headerProps.isScam ?? false}
          validationStatus={headerProps.validationStatus ?? "UNKNOWN"}
        />
      ) : null}
    </>
  );
};
