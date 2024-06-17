import { Box, type BoxProps, type FlexProps } from "@chakra-ui/react";

import { PrettyNumber } from "./PrettyNumber";
import { type RawPkh } from "../types/Address";
import { prettyTezAmount } from "../utils/format";
import { useGetAccountBalance } from "../utils/hooks/assetsHooks";

export const AccountBalance: React.FC<
  { address: RawPkh; size?: "md" | "lg"; numberProps?: FlexProps } & BoxProps
> = ({ address, size, numberProps, ...props }) => {
  const getBalance = useGetAccountBalance();
  const balance = getBalance(address);

  if (!balance) {
    return null;
  }

  const balanceInTez = prettyTezAmount(balance);

  return (
    <Box overflow="hidden" textAlign="right" data-testid="account-balance" {...props}>
      <PrettyNumber number={balanceInTez} size={size} {...numberProps} />
    </Box>
  );
};
