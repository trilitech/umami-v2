import { Flex } from "@chakra-ui/react";
import { AddressKind } from "../AddressTile/types";
import { Identicon } from "../Identicon";
import colors from "../../style/colors";
import AddressTileIcon from "../AddressTile/AddressTileIcon";

const AccountTileIcon: React.FC<{ addressKind: AddressKind }> = ({ addressKind }) => {
  switch (addressKind.type) {
    case "mnemonic":
      return <Identicon w="48px" h="48px" p="8px" identiconSize={32} address={addressKind.pkh} />;
    default: {
      const bg = addressKind.type === "social" ? "white" : colors.gray[500];
      return (
        <Flex bg={bg} borderRadius="4px" p="4px" justifyContent="center" alignItems="center">
          <AddressTileIcon addressKind={addressKind} size="lg" />
        </Flex>
      );
    }
  }
};

export default AccountTileIcon;
