import { Box, Card, HStack, Icon, VStack } from "@chakra-ui/react";

import { AlertCircleIcon, AlertTriangleIcon, VerifiedIcon } from "../../assets/icons";

export type VerificationAlert = {
  color: string;
  icon: typeof AlertTriangleIcon;
  text: string;
};
export type ValidationStatus = "SCAM" | "UNKNOWN" | "INVALID" | "VALID";

const getVerificationAlert = (validationStatus: ValidationStatus) => {
  const statusOptions: Record<ValidationStatus, VerificationAlert> = {
    SCAM: {
      color: "red.500",
      icon: AlertTriangleIcon,
      text: "This domain is suspected to be a SCAM. Potential threat detected.",
    },
    UNKNOWN: {
      color: "yellow.500",
      icon: AlertCircleIcon,
      text: "This domain is unknown. Cannot verify it.",
    },
    INVALID: {
      color: "yellow.500",
      icon: AlertTriangleIcon,
      text: "This domain is invalid.",
    },
    VALID: {
      color: "green.500",
      icon: VerifiedIcon,
      text: "This domain is verified.",
    },
  };
  return (
    <HStack
      margin="auto"
      padding="8px"
      border="1px solid"
      borderColor={statusOptions[validationStatus].color}
      borderRadius="md"
    >
      <Icon as={statusOptions[validationStatus].icon} verticalAlign="bottom" />
      <Card marginLeft="8px">{statusOptions[validationStatus].text}</Card>
    </HStack>
  );
};

export const VerifyInfobox = ({
  isScam,
  validationStatus,
}: {
  isScam?: boolean;
  validationStatus: "UNKNOWN" | "INVALID" | "VALID";
}) => (
  <Box textAlign="left" data-testid="verifyinfobox">
    <VStack margin="auto" marginTop="16px" marginBottom="16px" spacing="16px">
      {isScam ? getVerificationAlert("SCAM") : getVerificationAlert(validationStatus)}
    </VStack>
  </Box>
);
