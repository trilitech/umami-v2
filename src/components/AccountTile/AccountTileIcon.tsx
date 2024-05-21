import { Flex } from "@chakra-ui/react";

import { EmailIcon, FacebookIcon, GoogleIcon, RedditIcon, TwitterIcon } from "../../assets/icons";
import colors from "../../style/colors";
import { Account } from "../../types/Account";
import { AddressTileIcon } from "../AddressTile/AddressTileIcon";
import { useAddressKind } from "../AddressTile/useAddressKind";
import { Identicon } from "../Identicon";

export const AccountTileIcon: React.FC<{ account: Account; identiconSize?: number }> = ({
  account,
  identiconSize = 32,
}) => {
  const addressKind = useAddressKind(account.address);
  switch (account.type) {
    case "secret_key":
    case "mnemonic":
      return (
        <Identicon
          width="48px"
          height="48px"
          padding="8px"
          address={account.address}
          identiconSize={identiconSize}
        />
      );
    case "social": {
      let icon;
      switch (account.idp) {
        case "google":
          icon = <GoogleIcon width="27.44px" height="28px" />;
          break;
        case "facebook":
          icon = <FacebookIcon width="30px" height="30px" />;
          break;
        case "twitter":
          icon = <TwitterIcon width="22.44px" height="21px" />;
          break;
        case "reddit":
          icon = <RedditIcon width="28px" height="28px" />;
          break;
        case "email":
          icon = <EmailIcon width="28px" height="28px" color="black" />;
      }
      return (
        <Flex
          alignItems="center"
          justifyContent="center"
          width="48px"
          height="48px"
          padding="4px"
          background="white"
          borderRadius="4px"
        >
          {icon}
        </Flex>
      );
    }
    case "ledger":
    case "multisig":
      return (
        <Flex
          alignItems="center"
          justifyContent="center"
          padding="4px"
          background={colors.gray[500]}
          borderRadius="4px"
        >
          <AddressTileIcon addressKind={addressKind} size="md" />
        </Flex>
      );
  }
};
