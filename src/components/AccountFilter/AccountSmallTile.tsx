import { Flex, Box, Text, FlexProps } from "@chakra-ui/react";
import { formatPkh } from "../../utils/format";
import { useImplicitAccounts } from "../../utils/hooks/accountHooks";
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
        <Text color="white">{label}</Text>
        <Text color="umami.gray.400">{formatPkh(pkh)}</Text>
      </Box>
    </Flex>
  );
};

export const AccountSmallTile = ({ pkh }: { pkh: string }) => {
  const accounts = useImplicitAccounts();
  const account = accounts.find(a => a.address.pkh === pkh);
  return account ? (
    <AccountSmallTileDisplay pkh={account.address.pkh} label={account.label} />
  ) : null;
};
