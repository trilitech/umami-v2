import { ArrowBackIcon } from "@chakra-ui/icons";
import { IconButton, ModalCloseButton, ModalHeader, Text } from "@chakra-ui/react";
import colors from "../../style/colors";
import { FormOperations } from "../sendForm/types";
import { SignPageMode } from "./utils";

export const headerText = (operationType: FormOperations["type"], mode: SignPageMode): string => {
  let action;
  switch (operationType) {
    case "implicit":
      action = "Confirm";
      break;
    case "proposal":
      action = "Propose";
  }
  switch (mode) {
    case "single":
      return `${action} Transaction`;
    case "batch":
      return `${action} Batch`;
  }
};

export const SignPageHeader: React.FC<{
  goBack?: () => void;
  mode: SignPageMode;
  operationsType: FormOperations["type"];
}> = ({ goBack, mode, operationsType }) => {
  return (
    <ModalHeader textAlign="center" p="40px 0 32px 0">
      {goBack && (
        <IconButton
          size="lg"
          top="4px"
          left="4px"
          position="absolute"
          variant="ghost"
          aria-label="Back"
          color="umami.gray.450"
          icon={<ArrowBackIcon />}
          onClick={goBack}
          data-testid="go-back-button"
        />
      )}
      <Text size="2xl" fontWeight="600">
        {headerText(operationsType, mode)}
      </Text>
      <Text textAlign="center" size="sm" color={colors.gray[400]}>
        Confirm the transaction by signing it with your private key.
      </Text>
      <ModalCloseButton />
    </ModalHeader>
  );
};
