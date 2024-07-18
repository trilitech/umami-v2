import { Center, Icon } from "@chakra-ui/react";
import { ReactIdenticon } from "@umami/components";
import { type ImplicitAccount } from "@umami/core";

import {
  EnvelopeIcon,
  FacebookIcon,
  GoogleIcon,
  KeyIcon,
  RedditIcon,
  TwitterIcon,
  USBIcon,
} from "../../assets/icons";
import { useColor } from "../../styles/useColor";

export const AccountTileIcon = ({ account }: { account: ImplicitAccount }) => {
  const color = useColor();

  switch (account.type) {
    case "ledger":
      return <Icon as={USBIcon} width="32px" height="32px" color={color("600")} />;
    case "mnemonic":
      return (
        <Center borderRadius="full">
          <ReactIdenticon background="white" size={30} string={account.address.pkh} />
        </Center>
      );
    case "social": {
      switch (account.idp) {
        case "facebook":
          return <Icon as={FacebookIcon} width="48px" height="48px" />;
        case "google":
          return <Icon as={GoogleIcon} width="48px" height="48px" />;
        case "twitter":
          return <Icon as={TwitterIcon} width="28px" height="28px" />;
        case "email":
          return <Icon as={EnvelopeIcon} width="28px" height="28px" color={color("600")} />;
        case "reddit":
          return <Icon as={RedditIcon} width="28px" height="28px" />;
      }
    }
    // eslint-disable-next-line no-fallthrough
    case "secret_key":
      return <Icon as={KeyIcon} width="28px" height="28px" color={color("600")} />;
  }
};
