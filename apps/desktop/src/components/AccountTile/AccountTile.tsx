import {
  AspectRatio,
  Box,
  Divider,
  Flex,
  type FlexProps,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import { type Account, fullId, thumbnailUri } from "@umami/core";
import { useGetAccountBalance, useGetAccountDelegate, useGetAccountNFTs } from "@umami/state";
import { formatPkh, prettyTezAmount } from "@umami/tezos";
import type React from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";

import { AccountTileIcon } from "./AccountTileIcon";
import colors from "../../style/colors";
import { getIPFSurl, sortedByLastUpdate } from "../../utils/token/utils";
import { SelectedAccountContext } from "../../views/home/SelectedAccountContext";
import { useAddressKind } from "../AddressTile/useAddressKind";
import { color as identiconColor } from "../Identicon";

export const AccountTileBase: React.FC<
  {
    icon: React.ReactNode;
    leftElement: React.ReactNode;
    rightElement: React.ReactNode;
  } & FlexProps
> = ({ icon, leftElement, rightElement, ...flexProps }) => (
  <Flex
    alignItems="center"
    height="90px"
    marginBottom="16px"
    padding="16px"
    border={`1px solid ${colors.gray[800]}`}
    borderRadius="16px"
    data-testid="account-tile-base"
    {...flexProps}
  >
    {icon}
    <Flex alignItems="center" justifyContent="space-between" flex={1}>
      {leftElement}
      {rightElement}
    </Flex>
  </Flex>
);

export const LabelAndAddress: React.FC<{ label: string | null; pkh: string }> = ({
  label,
  pkh,
}) => (
  <Box margin={4} data-testid="account-identifier">
    {label && <Heading size="md">{label}</Heading>}
    <Flex alignItems="center">
      <Text color="text.dark" data-testid="short-address" size="sm">
        {formatPkh(pkh)}
      </Text>
    </Flex>
  </Box>
);

const MAX_NFT_COUNT = 7;

const accountIconGradientColor = (account: Account) => {
  switch (account.type) {
    case "mnemonic":
    case "secret_key":
      return identiconColor(account.address.pkh);
    case "ledger":
    case "multisig":
      return colors.gray[450];
    case "social":
      switch (account.idp) {
        case "facebook":
          return "#1977F2";
        case "google":
        case "reddit":
          return "#EA4335";
        case "email":
        case "twitter":
          return colors.gray[450];
      }
  }
};

export const accountIconGradient = ({
  account,
  radius,
  left = "0px",
  top = "0px",
  mainBackgroundColor = colors.gray[900],
  opacity = "60", // hex value string
}: {
  account: Account;
  radius: string;
  left?: string;
  top?: string;
  mainBackgroundColor?: string;
  opacity?: string;
}) => {
  let color = accountIconGradientColor(account);

  color += opacity;

  return `radial-gradient(circle farthest-side at ${left} ${top}, ${color} 0%, ${color} ${
    parseInt(radius) / 4
  }px, transparent ${radius}), ${mainBackgroundColor}`;
};

export const AccountTile: React.FC<{
  account: Account;
}> = ({ account }) => {
  const pkh = account.address.pkh;
  const { selectedAccount, selectAccount } = useContext(SelectedAccountContext);
  const isSelected = selectedAccount?.address.pkh === pkh;
  const addressKind = useAddressKind(account.address);
  const balance = useGetAccountBalance()(pkh);
  const currentDelegate = useGetAccountDelegate()(pkh);
  const nfts = sortedByLastUpdate(useGetAccountNFTs()(pkh));

  return (
    <Box
      zIndex={2}
      background={accountIconGradient({
        left: "-10px",
        top: "-10px",
        account,
        radius: nfts.length > 0 ? "120px" : "100px",
      })}
      borderWidth="1px"
      borderStyle="solid"
      borderColor={isSelected ? colors.orangeL : colors.gray[900]}
      borderRadius="8px"
      _hover={{
        borderColor: isSelected ? colors.orangeL : colors.gray[700],
      }}
      cursor="pointer"
      data-testid="account-tile-container"
      onClick={() => selectAccount(account)}
      paddingX="21px"
    >
      <AccountTileBase
        align="bottom"
        marginBottom={0}
        padding={0}
        border="none"
        data-testid={`account-tile-${pkh}` + (isSelected ? "-selected" : "")}
        icon={<AccountTileIcon account={account} size="lg" />}
        leftElement={<LabelAndAddress label={addressKind.label} pkh={pkh} />}
        rightElement={
          <Flex flexDirection="column">
            {balance && (
              <Heading alignSelf="flex-end" data-testid="balance" size="md">
                {prettyTezAmount(balance)}
              </Heading>
            )}
            <Text
              align="right"
              color={colors.gray[450]}
              fontWeight={700}
              data-testid="is-delegated"
              size="sm"
            >
              {/* crutch to make some the same padding at the top */}
              {/* TODO: split it into separate components instead of right/left elements */}
              {currentDelegate ? "Delegated" : <>&nbsp;</>}
            </Text>
          </Flex>
        }
      />
      {nfts.length > 0 && (
        <Flex flexDirection="column" data-testid="nfts-list">
          <Divider />
          <Flex marginY="21px">
            {nfts.slice(0, MAX_NFT_COUNT).map((nft, i) => {
              const url = getIPFSurl(thumbnailUri(nft));

              if (i === MAX_NFT_COUNT - 1) {
                return (
                  <Link key="last" data-testid="show-more-nfts-link" to={`/nfts?accounts=${pkh}`}>
                    <Box
                      height="32px"
                      marginLeft="4px"
                      background={colors.gray[600]}
                      borderRadius="4px"
                    >
                      <Text align="center" width="32px" color={colors.gray[450]} fontWeight={700}>
                        ...
                      </Text>
                    </Box>
                  </Link>
                );
              }
              return (
                <Link key={fullId(nft)} data-testid="nft-link" to={`/home/${pkh}/${fullId(nft)}`}>
                  <AspectRatio width="32px" height="32px" marginLeft={i > 0 ? "4px" : 0} ratio={1}>
                    <Image borderRadius="4px" src={url} />
                  </AspectRatio>
                </Link>
              );
            })}
          </Flex>
        </Flex>
      )}
    </Box>
  );
};
