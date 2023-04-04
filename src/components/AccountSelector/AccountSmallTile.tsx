import { Flex, Box, Text } from "@chakra-ui/react";
import { formatPkh } from "../../utils/format";
import { useAccounts } from "../../utils/hooks/accountHooks";
import { Identicon } from "../Identicon";

export const AccountSmallTile = ({
  pkh,
  label,
}: {
  pkh: string;
  label?: string;
}) => {
  return (
    <Flex>
      <Identicon address={pkh} mr={4} />
      <Box>
        <Text>{label}</Text>
        <Text color="umami.gray.600">{formatPkh(pkh)}</Text>
      </Box>
    </Flex>
  );
};

export const useRenderAccountSmallTile = () => {
  const accounts = useAccounts();

  return (pkh: string) => {
    const account = accounts.find((a) => a.pkh === pkh);
    return account ? (
      <AccountSmallTile pkh={account.pkh} label={account.label} />
    ) : null;
  };
};
