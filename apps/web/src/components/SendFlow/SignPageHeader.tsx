import { Heading, IconButton, ModalCloseButton, Text } from "@chakra-ui/react";
import { type AccountOperations, type ImplicitAccount } from "@umami/core";
import { type PropsWithChildren } from "react";

import { HeaderWrapper } from "./FormPageHeader";
import { type SignPageMode } from "./utils";
import { ArrowLeftCircleIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";

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

// TODO: pass in AccountOperations instead of signer & operationsType
export const SignPageHeader = ({
  goBack,
  mode,
  operationsType,
  signer,
  title,
  description,
  children,
}: PropsWithChildren<{
  goBack?: () => void;
  mode: SignPageMode;
  operationsType: AccountOperations["type"];
  signer: ImplicitAccount;
  title?: string;
  description?: string;
}>) => {
  const color = useColor();

  return (
    <HeaderWrapper>
      {goBack && (
        <IconButton
          color={color("400")}
          aria-label="back"
          icon={<ArrowLeftCircleIcon />}
          onClick={goBack}
        />
      )}
      <Heading data-testid="sign-page-header" size="2xl">
        {title || headerText(operationsType, mode)}
      </Heading>
      <Text marginTop="10px" color={color("400")} textAlign="center" size="sm">
        {description || subTitle(signer)}
      </Text>
      <ModalCloseButton />
      {children}
    </HeaderWrapper>
  );
};
