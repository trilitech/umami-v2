import { Flex } from "@chakra-ui/react";
import { AddressKind } from "../AddressTile/types";
import { Identicon } from "../Identicon";
import colors from "../../style/colors";
import { AddressTileIcon } from "../AddressTile/AddressTileIcon";

export const AccountTileIcon: React.FC<{ addressKind: AddressKind }> = ({ addressKind }) => {
  switch (addressKind.type) {
    case "secret_key":
    case "mnemonic":
      return (
        <Identicon
          width="48px"
          height="48px"
          padding="8px"
          address={addressKind.pkh}
          identiconSize={32}
        />
      );
    case "social":
    case "contact":
    case "ledger":
    case "multisig":
    case "unknown":
    case "baker": {
      const bg = addressKind.type === "social" ? "white" : colors.gray[500];
      return (
        <Flex
          alignItems="center"
          justifyContent="center"
          padding="4px"
          background={bg}
          borderRadius="4px"
        >
          <AddressTileIcon addressKind={addressKind} size="lg" />
        </Flex>
      );
    }
  }
};
