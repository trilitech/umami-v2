import { Box, type BoxProps, type FlexProps } from "@chakra-ui/react";
import { useGetAccountBalance } from "@umami/state";
import { type RawPkh, prettyTezAmount } from "@umami/tezos";

import { PrettyNumber } from "./PrettyNumber";

export const AccountBalance = ({
  address,
  size,
  numberProps,
  ...props
}: { address: RawPkh; size?: "md" | "lg"; numberProps?: FlexProps } & BoxProps) => {
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
