import { Flex, Heading, IconButton, ModalCloseButton, ModalHeader } from "@chakra-ui/react";
import { type AccountOperations, type ImplicitAccount } from "@umami/core";
import { type PropsWithChildren } from "react";

import { type SignPageMode } from "./utils";
import { ArrowLeftCircleIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";

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
  goBack,
  title,
  children,
}: PropsWithChildren<{
  goBack?: () => void;
  title?: string;
}>) => {
  const color = useColor();

  return (
    <ModalHeader>
      <Flex paddingTop="6px">
        {goBack && (
          <IconButton
            alignSelf="flex-start"
            width="22px"
            height="22px"
            marginTop="-30px"
            marginLeft="-20px"
            color={color("400")}
            aria-label="back"
            icon={<ArrowLeftCircleIcon />}
            onClick={goBack}
            variant="empty"
          />
        )}
      </Flex>
      <Heading data-testid="sign-page-header" size="xl">
        {title || "Confirm Transaction"}
      </Heading>
      <ModalCloseButton />
      {children}
    </ModalHeader>
  );
};
