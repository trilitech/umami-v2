import { AspectRatio, Box, Divider, Flex, FlexProps, Heading, Image, Text } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

import { AccountTileIcon } from "./AccountTileIcon";
import colors from "../../style/colors";
import { Account } from "../../types/Account";
import { fullId, thumbnailUri } from "../../types/Token";
import { formatPkh, prettyTezAmount } from "../../utils/format";
import { useGetAccountNFTs } from "../../utils/hooks/assetsHooks";
import { useAppSelector } from "../../utils/redux/hooks";
import { getIPFSurl, sortedByLastUpdate } from "../../utils/token/utils";
import { useAddressKind } from "../AddressTile/useAddressKind";
import { color as identiconColor } from "../Identicon";

export const AccountTileBase: React.FC<
  {
    icon: React.ReactNode;
    leftElement: React.ReactNode;
    rightElement: React.ReactNode;
  } & FlexProps
> = ({ icon, leftElement, rightElement, ...flexProps }) => {
  return (
    <Flex
      alignItems="center"
      height={90}
      marginBottom={4}
      padding={4}
      border={`1px solid ${colors.gray[800]}`}
      borderRadius={4}
      {...flexProps}
    >
      {icon}
      <Flex alignItems="center" justifyContent="space-between" flex={1}>
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
    <Box margin={4} data-testid="account-identifier">
      {label && <Heading size="md">{label}</Heading>}
      <Flex alignItems="center">
        <Text color="text.dark" data-testid="short-address" size="sm">
          {formatPkh(pkh)}
        </Text>
      </Flex>
    </Box>
  );
};

const MAX_NFT_COUNT = 7;

export const gradient = ({
  account,
  radius,
  mainBackgroundColor = colors.gray[900],
}: {
  account: Account;
  radius: string;
  mainBackgroundColor?: string;
}) => {
  const opacity = "55";
  let color: string;
  switch (account.type) {
    case "mnemonic":
    case "secret_key":
      color = identiconColor(account.address.pkh);
      break;
    case "ledger":
    case "multisig":
      color = colors.gray[450];
      break;
    case "social":
      color = "#EA4335";
  }

  color += opacity;

  return `radial-gradient(circle farthest-side at 0 0, ${color}, transparent ${radius}), ${mainBackgroundColor}`;
};

export const AccountTile: React.FC<{
  account: Account;
  balance: string | undefined;
  onClick?: () => void;
  selected?: boolean;
}> = ({ selected, onClick, account, balance }) => {
  const addressKind = useAddressKind(account.address);
  const {
    address: { pkh },
  } = account;
  // TODO: add a test for it!
  const isDelegating = !!useAppSelector(s => s.assets.delegationLevels)[pkh];

  const getNFTs = useGetAccountNFTs();
  const nfts = sortedByLastUpdate(getNFTs(pkh));

  return (
    <Box
      zIndex={2}
      background={gradient({ account, radius: nfts.length > 0 ? "120px" : "100px" })}
      borderWidth="1px"
      borderStyle="solid"
      borderColor={selected ? colors.orangeL : colors.gray[900]}
      borderRadius="8px"
      _hover={{
        borderColor: selected ? colors.orangeL : colors.gray[700],
      }}
      cursor="pointer"
      onClick={onClick}
      paddingX="21px"
    >
      <AccountTileBase
        align="bottom"
        marginBottom={0}
        padding={0}
        border="none"
        data-testid={`account-tile-${pkh}` + (selected ? "-selected" : "")}
        icon={<AccountTileIcon addressKind={addressKind} />}
        leftElement={<LabelAndAddress label={addressKind.label} pkh={pkh} />}
        rightElement={
          <Flex flexDirection="column">
            <Text align="right" color={colors.gray[450]} fontWeight={700} size="sm">
              {/* crutch to make some the same padding at the top */}
              {/* TODO: split it into separate components instead of right/left elements */}
              {isDelegating ? "Delegated" : <>&nbsp;</>}
            </Text>
            {balance && (
              <Heading alignSelf="flex-end" size="lg">
                {prettyTezAmount(balance)}
              </Heading>
            )}
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
