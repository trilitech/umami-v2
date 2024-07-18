import { Box, type ChakraProps } from "@chakra-ui/react";
import { ReactIdenticon } from "@umami/components";
import { type Address, type RawPkh } from "@umami/tezos";
import md5 from "md5";

export const color = (address: RawPkh) => `#${md5(address).slice(0, 6)}`;

export const Identicon = ({
  address,
  identiconSize,
  ...props
}: {
  address: Address;
  identiconSize: number;
} & ChakraProps) => (
  <Box
    sx={{
      canvas: {
        borderRadius: "4px",
      },
    }}
    zIndex={3}
    background="white"
    borderRadius="4px"
    data-testid="identicon"
    {...props}
  >
    <ReactIdenticon background="white" size={identiconSize} string={address.pkh} />
  </Box>
);
