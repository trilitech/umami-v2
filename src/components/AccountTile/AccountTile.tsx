import { Box, Flex, FlexProps, Heading, Text } from "@chakra-ui/layout";
import React from "react";
import colors from "../../style/colors";
import { formatPkh } from "../../utils/formatPkh";
import { prettyTezAmount } from "../../utils/format";
import useAddressKind from "../AddressTile/useAddressKind";
import { RawPkh, parsePkh } from "../../types/Address";
import AccountTileIcon from "./AccountTileIcon";
import { useAppSelector } from "../../utils/redux/hooks";

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
      bg={colors.gray[900]}
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

export const LabelAndAddress: React.FC<{ label: string | null; pkh: string }> = ({
  label,
  pkh,
}) => {
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

export const AccountTile: React.FC<{
  address: RawPkh;
  balance: string | undefined;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  selected?: boolean;
}> = ({ selected, onClick, address, balance }) => {
  const border = onClick ? `1px solid ${selected ? colors.orangeL : colors.gray[700]}` : undefined;
  const addressKind = useAddressKind(parsePkh(address));
  // TODO: add a test for it!
  const isDelegating = !!useAppSelector(s => s.assets.delegationLevels)[address];
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
      icon={<AccountTileIcon addressKind={addressKind} />}
      leftElement={<LabelAndAddress pkh={address} label={addressKind.label} />}
      rightElement={
        <Flex flexDirection="column">
          {isDelegating && (
            <Text align="right" fontWeight={700} color={colors.gray[450]} size="sm">
              Delegated
            </Text>
          )}
          {balance && (
            <Heading mb={4} alignSelf="flex-end" size="lg">
              {prettyTezAmount(balance)}
            </Heading>
          )}
        </Flex>
      }
    />
  );
};
