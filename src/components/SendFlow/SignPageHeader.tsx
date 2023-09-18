import { ModalCloseButton, Text } from "@chakra-ui/react";
import colors from "../../style/colors";
import { AccountOperations } from "../../types/AccountOperations";
import { SignPageMode } from "./utils";
import { HeaderWrapper } from "./FormPageHeader";
import { ModalBackButton } from "../ModalBackButton";

export const headerText = (
  operationType: AccountOperations["type"],
  mode: SignPageMode
): string => {
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
  operationsType: AccountOperations["type"];
}> = ({ goBack, mode, operationsType }) => {
  return (
    <HeaderWrapper>
      {goBack && <ModalBackButton onClick={goBack} />}
      <Text size="2xl" fontWeight="600">
        {headerText(operationsType, mode)}
      </Text>
      <Text textAlign="center" size="sm" color={colors.gray[400]}>
        Enter your password to confirm this transaction.
      </Text>
      <ModalCloseButton />
    </HeaderWrapper>
  );
};
