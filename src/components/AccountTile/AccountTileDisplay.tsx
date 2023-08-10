import { Box, Flex, FlexProps, Heading, Text } from "@chakra-ui/layout";
import React from "react";
import colors from "../../style/colors";
import { formatPkh } from "../../utils/formatPkh";
import { Identicon } from "../Identicon";

export type Props = {
  label: string;
  address: string;
  balance: string | undefined;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  selected?: boolean;
};

export const AccountTileBase: React.FC<
  {
    icon: React.ReactNode;
    leftElement: React.ReactNode;
    rightElement: React.ReactNode;
  } & FlexProps
> = ({ icon, leftElement, rightElement, ...flexProps }) => {
  return (
    <Flex
      mb={4}
      p={4}
      bg="umami.gray.900"
      h={90}
      borderRadius={4}
      border={`1px solid ${colors.gray[800]}`}
      alignItems="center"
      {...flexProps}
    >
      {icon}
      <Flex flex={1} justifyContent="space-between" alignItems="center">
        {leftElement}
        {rightElement}
      </Flex>
    </Flex>
  );
};

export const LabelAndAdress: React.FC<{ label?: string; pkh: string }> = ({ label, pkh }) => {
  return (
    <Box m={4} data-testid="account-identifier">
      {label && <Heading size="md">{label}</Heading>}
      <Flex alignItems="center">
        <Text size="sm" color="text.dark">
          {formatPkh(pkh)}
        </Text>
      </Flex>
    </Box>
  );
};

export const AccountTileDisplay: React.FC<Props> = ({
  selected,
  onClick,
  address,
  balance,
  label,
}) => {
  const border = onClick ? `1px solid ${selected ? colors.orangeL : colors.gray[700]}` : undefined;

  return (
    <AccountTileBase
      data-testid={`account-tile-${address}` + (selected ? "-selected" : "")}
      p={4}
      border={`1px solid ${selected ? colors.orangeL : colors.gray[800]}`}
      onClick={onClick}
      cursor="pointer"
      _hover={{
        border,
      }}
      icon={<Identicon address={address} />}
      leftElement={<LabelAndAdress pkh={address} label={label} />}
      rightElement={
        balance && (
          <Heading mb={4} alignSelf="flex-end" size="lg">
            {balance}
          </Heading>
        )
      }
    />
  );
};
