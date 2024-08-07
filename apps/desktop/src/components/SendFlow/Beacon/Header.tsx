import { type OperationRequestOutput } from "@airgap/beacon-wallet";
import { AspectRatio, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { type AccountOperations } from "@umami/core";
import { capitalize } from "lodash";

import colors from "../../../style/colors";
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
}) => (
  <SignPageHeader mode={mode} operationsType={operation.type} signer={operation.signer}>
    <Flex alignItems="center" justifyContent="center" marginTop="10px">
      <Heading marginRight="4px" color={colors.gray[450]} size="sm">
        Network:
      </Heading>
      <Text color={colors.gray[400]} size="sm">
        {capitalize(message.network.type)}
      </Text>
    </Flex>

    <Flex
      alignItems="center"
      marginTop="16px"
      padding="15px"
      borderRadius="4px"
      backgroundColor={colors.gray[800]}
    >
      <AspectRatio width="30px" marginRight="12px" ratio={1}>
        <Image borderRadius="4px" src={message.appMetadata.icon} />
      </AspectRatio>
      <Heading size="sm">{message.appMetadata.name}</Heading>
    </Flex>
  </SignPageHeader>
);
