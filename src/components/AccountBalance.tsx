import { Box, BoxProps } from "@chakra-ui/react";
import { useGetAccountBalance } from "../utils/hooks/assetsHooks";
import { PrettyNumber } from "./PrettyNumber";
import { prettyTezAmount } from "../utils/format";
import { RawPkh } from "../types/Address";

export const AccountBalance: React.FC<{ address: RawPkh; size?: "md" | "lg" } & BoxProps> = ({
  address,
  size,
  ...props
}) => {
  const getBalance = useGetAccountBalance();
  const balance = getBalance(address);

  if (!balance) {
    return null;
  }

  const balanceInTez = prettyTezAmount(balance);

  return (
    <Box data-testid="account-balance" textAlign="right" overflow="hidden" {...props}>
      <PrettyNumber number={balanceInTez} size={size} />
    </Box>
  );
};
