import { Flex, Heading, ModalHeader } from "@chakra-ui/react";
import { type AccountOperations, type ImplicitAccount } from "@umami/core";
import { type PropsWithChildren } from "react";

import { type SignPageMode } from "./utils";
import { ModalBackButton } from "../BackButton";
import { ModalCloseButton } from "../CloseButton";

/**
 * @deprecated - not needed in web, was copied over from desktop
 */
export const headerText = (
  _operationType: AccountOperations["type"],
  _mode: SignPageMode
): string => "Confirm Transaction";

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

export const SignPageHeader = ({
  title,
  children,
}: PropsWithChildren<{
  goBack?: () => void;
  title?: string;
}>) => (
  <ModalHeader>
    <Flex paddingTop="6px">
      <ModalBackButton />
    </Flex>
    <Heading data-testid="sign-page-header" size="xl">
      {title || "Confirm Transaction"}
    </Heading>
    <ModalCloseButton />
    {children}
  </ModalHeader>
);
