import { AspectRatio, Image, Flex, Text, Heading } from "@chakra-ui/react";
import colors from "../../style/colors";
import { formatPkh } from "../../utils/format";
import { useGetBaker } from "../../utils/hooks/assetsHooks";
import { RawPkh } from "../../types/Address";

export const BakerSmallTile: React.FC<{ pkh: RawPkh }> = ({ pkh }) => {
  const getBaker = useGetBaker();
  const baker = getBaker(pkh);

  if (!baker) {
    return null;
  }

  const logoUrl = `https://services.tzkt.io/v1/avatars/${baker.address}`;

  return (
    <Flex
      alignItems="center"
      width="100%"
      background={colors.gray[800]}
      data-testid="baker-tile"
      paddingX="15px"
      paddingY="9px"
    >
      <AspectRatio width="30px" height="30px" marginRight="8px" ratio={1}>
        <Image src={logoUrl} />
      </AspectRatio>
      <Flex alignItems="center" marginLeft="8px">
        <Heading size="sm">{baker.name}</Heading>
        <Text color={colors.gray[300]} marginX="12px" size="sm">
          {formatPkh(baker.address)}
        </Text>
      </Flex>
    </Flex>
  );
};
