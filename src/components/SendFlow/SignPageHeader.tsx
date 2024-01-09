import { Heading, ModalCloseButton, Text } from "@chakra-ui/react";

import { HeaderWrapper } from "./FormPageHeader";
import { SignPageMode } from "./utils";
import colors from "../../style/colors";
import { AccountOperations } from "../../types/AccountOperations";
import { ModalBackButton } from "../ModalBackButton";

export const headerText = (
  operationType: AccountOperations["type"],
  mode: SignPageMode
): string => {
  let action;
  switch (operationType) {
    case "implicit":
      action = mode === "batch" ? "Submit" : "Confirm";
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
      <Heading size="2xl">{headerText(operationsType, mode)}</Heading>
      <Text color={colors.gray[400]} textAlign="center" size="sm">
        Enter your password to confirm this transaction.
      </Text>
      <ModalCloseButton />
    </HeaderWrapper>
  );
};
