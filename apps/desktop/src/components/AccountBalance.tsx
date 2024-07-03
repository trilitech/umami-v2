import { Box, type BoxProps, type FlexProps } from "@chakra-ui/react";
import { useGetAccountBalance } from "@umami/state";
import { type RawPkh } from "@umami/tezos";
import { prettyTezAmount } from "@umami/tezos";

import { PrettyNumber } from "./PrettyNumber";

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
