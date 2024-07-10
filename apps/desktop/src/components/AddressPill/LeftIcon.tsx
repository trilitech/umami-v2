import { type IconProps } from "@chakra-ui/react";
import { type AddressKind } from "@umami/components";
import { memo } from "react";

import { BakerIcon, ContactIcon, FA12Icon, FA2Icon, KeyIcon } from "../../assets/icons";

export const LeftIcon = memo(
  ({ addressKind: { type }, ...props }: { addressKind: AddressKind } & IconProps) => {
    switch (type) {
      case "multisig":
        return <KeyIcon data-testid={`${type}-icon`} {...props} />;
      case "fa1.2":
        return (
          <FA12Icon data-testid={`${type}-icon`} {...props} fill={props.stroke} stroke="none" />
        );
      case "fa2":
        return (
          <FA2Icon data-testid={`${type}-icon`} {...props} fill={props.stroke} stroke="none" />
        );
      case "baker":
        return <BakerIcon data-testid={`${type}-icon`} {...props} />;
      case "contact":
        return <ContactIcon data-testid={`${type}-icon`} {...props} />;
      case "unknown":
      case "ledger":
      case "mnemonic":
      case "secret_key":
      case "social":
        return null;
    }
  }
);
