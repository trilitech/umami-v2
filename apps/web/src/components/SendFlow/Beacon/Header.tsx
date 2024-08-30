import { type OperationRequestOutput } from "@airgap/beacon-wallet";
import { AspectRatio, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { capitalize } from "lodash";

import { CodeSandboxIcon } from "../../../assets/icons";
import { useColor } from "../../../styles/useColor";
import { SignPageHeader } from "../SignPageHeader";

export const Header = ({ message }: { message: OperationRequestOutput }) => {
  const color = useColor();

  return (
    <SignPageHeader>
      <Flex alignItems="center" justifyContent="center" marginTop="10px">
        <Heading marginRight="4px" color={color("700")} size="sm">
          Network:
        </Heading>
        <Text color={color("700")} fontWeight="400" size="sm">
          {capitalize(message.network.type)}
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
            src={message.appMetadata.icon}
          />
        </AspectRatio>
        <Heading size="sm">{message.appMetadata.name}</Heading>
      </Flex>
    </SignPageHeader>
  );
};
