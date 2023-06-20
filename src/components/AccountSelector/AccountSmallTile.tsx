import { Box, Flex, FlexProps, Text } from "@chakra-ui/react";
import { formatPkh } from "../../utils/format";
import { useAllAccounts } from "../../utils/hooks/accountHooks";
import { Identicon } from "../Identicon";

export const AccountSmallTileDisplay = ({
  pkh,
  label,
  ...flexProps
}: {
  pkh: string;
  label?: string;
} & FlexProps) => {
  return (
    <Flex {...flexProps}>
      <Identicon address={pkh} mr={4} />
      <Box>
        <Text>{label}</Text>
        <Text color="umami.gray.600">{formatPkh(pkh)}</Text>
      </Box>
    </Flex>
  );
};

export const AccountSmallTile = ({ pkh }: { pkh: string }) => {
  const accounts = useAllAccounts();
  const account = accounts.find(a => a.address.pkh === pkh);
  return account ? (
    <AccountSmallTileDisplay pkh={account.address.pkh} label={account.label} />
  ) : null;
};
