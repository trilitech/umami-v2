import { AspectRatio, Image, Flex, Text, Heading } from "@chakra-ui/react";
import colors from "../../style/colors";
import { formatPkh } from "../../utils/format";
import { useGetBaker, useGetDelegateOf } from "../../utils/hooks/assetsHooks";
import { RawPkh } from "../../types/Address";
import { Account } from "../../types/Account";

export const BakerSmallTile: React.FC<{ pkh: RawPkh }> = ({ pkh }) => {
  const getBaker = useGetBaker();
  const baker = getBaker(pkh);

  if (!baker) {
    return null;
  }

  const logoUrl = `https://services.tzkt.io/v1/avatars/${baker.address}`;

  return (
    <Flex
      bg={colors.gray[800]}
      w="100%"
      alignItems="center"
      px="15px"
      py="9px"
      data-testid="baker-tile"
    >
      <AspectRatio mr="8px" height="30px" width="30px" ratio={1}>
        <Image src={logoUrl} />
      </AspectRatio>
      <Flex ml="8px" alignItems="center">
        <Heading size="sm">{baker.name}</Heading>
        <Text mx="12px" color={colors.gray[300]} size="sm">
          {formatPkh(baker.address)}
        </Text>
      </Flex>
    </Flex>
  );
};

// Get the baker of the account's delegation
export const DelegateSmallTile: React.FC<{ account: Account }> = ({ account }) => {
  const getDelegateOf = useGetDelegateOf();
  const baker = getDelegateOf(account);
  if (!baker) {
    return null;
  }
  return <BakerSmallTile pkh={baker.address} />;
};
