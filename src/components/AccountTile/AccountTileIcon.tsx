import { Flex } from "@chakra-ui/react";
import { AddressKind } from "../AddressTile/types";
import { Identicon } from "../Identicon";
import colors from "../../style/colors";
import AddressTileIcon from "../AddressTile/AddressTileIcon";

const AccountTileIcon: React.FC<{ addressKind: AddressKind }> = ({ addressKind }) => {
  switch (addressKind.type) {
    case "secret_key":
    case "mnemonic":
      return <Identicon w="48px" h="48px" p="8px" identiconSize={32} address={addressKind.pkh} />;
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

export default AccountTileIcon;
