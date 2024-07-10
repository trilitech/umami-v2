import { Icon, type IconProps } from "@chakra-ui/react";
import { type AddressKind } from "@umami/components";
import { memo } from "react";

import { ContactIcon, DelegateIcon, FA12Icon, FA2Icon, KeyIcon } from "../../assets/icons";

export const LeftIcon = memo(
  ({ addressKind: { type }, ...props }: { addressKind: AddressKind } & IconProps) => {
    switch (type) {
      case "multisig":
        return <Icon as={KeyIcon} data-testid={`${type}-icon`} {...props} />;
      case "fa1.2":
        return (
          <Icon as={FA12Icon} width="32px" height="18px" data-testid={`${type}-icon`} {...props} />
        );
      case "fa2":
        return (
          <Icon as={FA2Icon} width="25px" height="18px" data-testid={`${type}-icon`} {...props} />
        );
      case "baker":
        return <Icon as={DelegateIcon} data-testid={`${type}-icon`} {...props} />;
      case "contact":
        return <Icon as={ContactIcon} data-testid={`${type}-icon`} {...props} />;
      case "unknown":
      case "ledger":
      case "mnemonic":
      case "secret_key":
      case "social":
        return null;
    }
  }
);
