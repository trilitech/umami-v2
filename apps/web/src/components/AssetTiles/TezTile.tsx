import { Box, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import { useGetAccountBalance, useTezToDollar } from "@umami/state";
import { mutezToTez, prettyTezAmount } from "@umami/tezos";
import { type BigNumber } from "bignumber.js";

import { TezIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";

export type TezTileProps = {
  address?: string;
  mutezAmount?: string | number | BigNumber;
};

export const TezTile = ({ address, mutezAmount }: TezTileProps) => {
  const color = useColor();
  const getBalance = useGetAccountBalance();
  const tezToDollar = useTezToDollar();

  const getCurrentBalance = () => {
    if (mutezAmount !== undefined) {
      return mutezAmount;
    }
    if (address) {
      return getBalance(address);
    }
  };

  const getDollarBalance = () => {
    if (getCurrentBalance() === undefined) {
      return undefined;
    }

    const usdBalance = tezToDollar(mutezToTez(getCurrentBalance()!).toFixed());
    return usdBalance !== undefined && `$${usdBalance}`;
  };

  return (
    <Box padding="16px" background={color("100")} borderRadius="6px">
      <Flex alignItems="center">
        <Icon
          as={TezIcon}
          boxSize="42px"
          marginRight="16px"
          borderRadius="6px"
          data-testid="tez-icon"
        />
        <Box>
          <Heading color={color("900")} size="md">
            {getCurrentBalance() !== undefined ? prettyTezAmount(getCurrentBalance()!) : "0.00 ꜩ"}
          </Heading>
          {getDollarBalance() && (
            <Text color={color("700")} data-testid="tez-dollar-amount" size="sm">
              {getDollarBalance()}
            </Text>
          )}
        </Box>
      </Flex>
    </Box>
  );
};
