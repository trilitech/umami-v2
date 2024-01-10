import { Heading, ModalCloseButton, Text } from "@chakra-ui/react";

import { HeaderWrapper } from "./FormPageHeader";
import { SignPageMode } from "./utils";
import colors from "../../style/colors";
import { ImplicitAccount } from "../../types/Account";
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

export const subTitle = (signer: ImplicitAccount): string | undefined => {
  switch (signer.type) {
    case "ledger":
    case "social":
      return;
    case "mnemonic":
    case "secret_key":
      return "Enter your password to confirm this transaction.";
  }
};

export const SignPageHeader: React.FC<{
  goBack?: () => void;
  mode: SignPageMode;
  operationsType: AccountOperations["type"];
  signer: ImplicitAccount;
}> = ({ goBack, mode, operationsType, signer }) => {
  return (
    <HeaderWrapper>
      {goBack && <ModalBackButton onClick={goBack} />}
      <Heading size="2xl">{headerText(operationsType, mode)}</Heading>
      <Text color={colors.gray[400]} textAlign="center" size="sm">
        {subTitle(signer)}
      </Text>
      <ModalCloseButton />
    </HeaderWrapper>
  );
};
