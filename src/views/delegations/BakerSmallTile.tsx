import { AspectRatio, Image, Flex, Box, Text } from "@chakra-ui/react";
import colors from "../../style/colors";
import { formatPkh } from "../../utils/format";
import { useGetBaker } from "../../utils/hooks/assetsHooks";
import { RawPkh } from "../../types/Address";

export const BakerSmallTile = ({ pkh }: { pkh: RawPkh }) => {
  const getBaker = useGetBaker();
  const baker = getBaker(pkh);
  if (!baker) {
    return null;
  }

  const logoUrl = `https://services.tzkt.io/v1/avatars/${pkh}`;

  return (
    <Flex>
      <AspectRatio ml={2} mr={2} height="40px" width="40px" ratio={1}>
        <Image src={logoUrl} />
      </AspectRatio>
      <Box ml={2}>
        <Text fontWeight={600}>{baker.name}</Text>
        <Text color={colors.gray[300]} size="sm">
          {formatPkh(pkh)}
        </Text>
      </Box>
    </Flex>
  );
};
