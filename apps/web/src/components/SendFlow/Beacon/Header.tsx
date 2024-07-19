import { type OperationRequestOutput } from "@airgap/beacon-wallet";
import { AspectRatio, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { type AccountOperations } from "@umami/core";
import { capitalize } from "lodash";

import { useColor } from "../../../styles/useColor";
import { SignPageHeader } from "../SignPageHeader";
import { type SignPageMode } from "../utils";

export const Header = ({
  operation,
  message,
  mode,
}: {
  operation: AccountOperations;
  message: OperationRequestOutput;
  mode: SignPageMode;
}) => {
  const color = useColor();

  return (
    <SignPageHeader mode={mode} operationsType={operation.type} signer={operation.signer}>
      <Flex alignItems="center" justifyContent="center" marginTop="10px">
        <Heading marginRight="4px" color={color("450")} size="sm">
          Network:
        </Heading>
        <Text color={color("400")} size="sm">
          {capitalize(message.network.type)}
        </Text>
      </Flex>

      <Flex
        alignItems="center"
        marginTop="16px"
        padding="15px"
        borderRadius="4px"
        backgroundColor={color("800")}
      >
        <AspectRatio width="30px" marginRight="12px" ratio={1}>
          <Image borderRadius="4px" src={message.appMetadata.icon} />
        </AspectRatio>
        <Heading size="sm">{message.appMetadata.name}</Heading>
      </Flex>
    </SignPageHeader>
  );
};
