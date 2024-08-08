import { Center, Heading } from "@chakra-ui/react";
import { type NFTBalance } from "@umami/core";

import { useColor } from "../../styles/useColor";

export const NFTBalancePill = ({ nft }: { nft: NFTBalance }) => {
  const color = useColor();
  if (Number(nft.balance) < 2) {
    return null;
  }

  return (
    <Center
      position="absolute"
      bottom="12px"
      left="12px"
      padding="4px 12px"
      color={color("900")}
      background={color("300")}
      borderRadius="full"
      data-testid="nft-balance"
    >
      <Heading size="sm">{nft.balance}</Heading>
    </Center>
  );
};
