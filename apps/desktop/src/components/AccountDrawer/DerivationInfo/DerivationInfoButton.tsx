import { Button, type ButtonProps } from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import { type Account } from "@umami/core";

import { InfoModal } from "./InfoModal";
import { FolderInfoIcon } from "../../../assets/icons";

/**
 * Button to open a modal with the account's derivation info
 *
 * @param account -
 * @returns null if the account's derivation path is unknown, a button to open the modal otherwise
 */
export const DerivationInfoButton = ({ account, ...props }: { account: Account } & ButtonProps) => {
  const { openWith } = useDynamicModalContext();

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
