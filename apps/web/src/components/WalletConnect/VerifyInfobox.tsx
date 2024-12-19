import { Box, Card, HStack, Icon, VStack } from "@chakra-ui/react";

import { AlertCircleIcon, AlertTriangleIcon, VerifiedIcon } from "../../assets/icons";

export const VerifyInfobox = ({
  isScam,
  validationStatus,
}: {
  isScam: boolean;
  validationStatus: "UNKNOWN" | "INVALID" | "VALID";
}) => (
  <Box textAlign="left">
    <VStack margin="auto" marginTop="16px" spacing="16px">
      {isScam ? (
        <HStack
          margin="auto"
          padding="8px"
          border="1px solid"
          borderColor="red.500"
          borderRadius="md"
        >
          <Icon as={AlertTriangleIcon} verticalAlign="bottom" />
          <Card marginLeft="8px">This domain is a suspected as a SCAM. Potential threat. </Card>
        </HStack>
      ) : validationStatus === "UNKNOWN" ? (
        <HStack
          margin="auto"
          padding="8px"
          border="1px solid"
          borderColor="yellow.500"
          borderRadius="md"
        >
          <Icon as={AlertCircleIcon} verticalAlign="bottom" />
          <Card marginLeft="8px">This domain is unknown. Cannot verify it.</Card>
        </HStack>
      ) : validationStatus === "INVALID" ? (
        <HStack
          margin="auto"
          padding="8px"
          border="1px solid"
          borderColor="yellow.500"
          borderRadius="md"
        >
          <Icon as={AlertTriangleIcon} verticalAlign="bottom" />
          <Card marginLeft="8px">This domain is invalid. </Card>
        </HStack>
      ) : (
        // VALID
        <HStack
          margin="auto"
          padding="8px"
          border="1px solid"
          borderColor="green.500"
          borderRadius="md"
        >
          <Icon as={VerifiedIcon} verticalAlign="bottom" />
          <Card marginLeft="8px">This domain is verified. </Card>
        </HStack>
      )}
    </VStack>
  </Box>
);
