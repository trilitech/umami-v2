import { Box, Flex, Heading, Text } from "@chakra-ui/layout";
import React from "react";
import colors from "../../style/colors";
import { formatPkh } from "../../utils/format";
import { Identicon } from "../Identicon";

export type Props = {
  label: string;
  address: string;
  balance: string | undefined;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  selected?: boolean;
};

export const AccountTileDisplay: React.FC<Props> = ({
  selected,
  onClick,
  address,
  balance,
  label,
}) => {
  const border = onClick ? `1px solid ${selected ? colors.orange : colors.gray[700]}` : undefined;
  return (
    <Flex
      data-testid={`account-tile-${address}` + (selected ? "-selected" : "")}
      mb={4}
      p={4}
      bg="umami.gray.900"
      h={90}
      borderRadius={4}
      border={`1px solid ${selected ? colors.orange : colors.gray[800]}`} // string theme colors "umami.orange" don't work for borders
      onClick={onClick}
      cursor="pointer"
      _hover={{
        border,
      }}
      alignItems="center"
    >
      <Identicon address={address} />
      <Flex flex={1} justifyContent="space-between">
        <Box m={4} data-testid="account-identifiers">
          <Heading size={"md"}>{label}</Heading>
          <Flex alignItems={"center"}>
            <Text size={"sm"} color="text.dark">
              {formatPkh(address)}
            </Text>
          </Flex>
        </Box>
        {balance && (
          <Heading mb={4} alignSelf={"flex-end"} size={"lg"}>
            {balance}
          </Heading>
        )}
      </Flex>
    </Flex>
  );
};
