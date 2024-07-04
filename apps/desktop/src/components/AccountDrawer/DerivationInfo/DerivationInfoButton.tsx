import { Button, type ButtonProps } from "@chakra-ui/react";
import { DynamicModalContext } from "@umami/components";
import { type Account } from "@umami/core";
import { useContext } from "react";

import { InfoModal } from "./InfoModal";
import { FolderInfoIcon } from "../../../assets/icons";

/**
 * Button to open a modal with the account's derivation info
 *
 * @param account -
 * @returns null if the account's derivation path is unknown, a button to open the modal otherwise
 */
export const DerivationInfoButton: React.FC<{ account: Account } & ButtonProps> = ({
  account,
  ...props
}) => {
  const { openWith } = useContext(DynamicModalContext);

  switch (account.type) {
    // for those we cannot know the derivation path
    case "multisig":
    case "secret_key":
    case "social":
      return null;
    case "ledger":
    case "mnemonic":
      return (
        <Button
          data-testid="derivation-info-button"
          onClick={() => openWith(<InfoModal account={account} />)}
          variant="CTAWithIcon"
          {...props}
        >
          <FolderInfoIcon stroke="currentcolor" />
        </Button>
      );
  }
};
