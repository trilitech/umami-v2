import { Box, Flex, FlexProps, Heading, Text, Divider, AspectRatio, Image } from "@chakra-ui/react";
import React from "react";
import colors from "../../style/colors";
import { formatPkh, prettyTezAmount } from "../../utils/format";
import useAddressKind from "../AddressTile/useAddressKind";
import { RawPkh, parsePkh } from "../../types/Address";
import AccountTileIcon from "./AccountTileIcon";
import { useAppSelector } from "../../utils/redux/hooks";
import { useGetAccountNFTs } from "../../utils/hooks/assetsHooks";
import { fullId, thumbnailUri } from "../../types/Token";
import { getIPFSurl } from "../../utils/token/nftUtils";
import { Link } from "react-router-dom";

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
      background={colors.gray[900]}
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
        <Text color="text.dark" size="sm">
          {formatPkh(pkh)}
        </Text>
      </Flex>
    </Box>
  );
};

const MAX_NFT_COUNT = 7;

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

  const getNFTs = useGetAccountNFTs();
  const nfts = getNFTs(address);

  return (
    <Box
      background={colors.gray[900]}
      border={`1px solid ${selected ? colors.orangeL : colors.gray[800]}`}
      borderRadius="8px"
      _hover={{
        border,
      }}
      cursor="pointer"
      onClick={onClick}
      paddingX="21px"
    >
      <AccountTileBase
        data-testid={`account-tile-${address}` + (selected ? "-selected" : "")}
        p={0}
        mb={0}
        align="bottom"
        border="none"
        icon={<AccountTileIcon addressKind={addressKind} />}
        leftElement={<LabelAndAddress pkh={address} label={addressKind.label} />}
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
        <Flex flexDirection="column">
          <Divider />
          <Flex marginY="21px">
            {nfts.slice(0, MAX_NFT_COUNT).map((nft, i) => {
              const url = getIPFSurl(thumbnailUri(nft));

              if (i === MAX_NFT_COUNT - 1) {
                return (
                  <Link to="/nfts" key="last">
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
                <Link
                  data-testid={`nft-link-${nft.contract}`}
                  to={`/home/${address}/${fullId(nft)}`}
                  key={fullId(nft)}
                >
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
