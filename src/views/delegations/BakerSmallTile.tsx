import { AspectRatio, Image, Flex, Box, Text } from "@chakra-ui/react";
import colors from "../../style/colors";
import { formatPkh } from "../../utils/format";
import { useBakerList } from "../../utils/hooks/assetsHooks";

export const BakerSmallTile = ({
  pkh,
  label,
  imageUrl,
}: {
  pkh: string;
  label?: string;
  imageUrl?: string;
}) => {
  return (
    <Flex>
      <AspectRatio ml={2} mr={2} height={6} width={6} ratio={1}>
        <Image src={imageUrl} />
      </AspectRatio>
      <Box ml={2}>
        <Text fontWeight={600}>{label}</Text>
        <Text color={colors.gray[300]} size="sm">
          {formatPkh(pkh)}
        </Text>
      </Box>
    </Flex>
  );
};

export const useRenderBakerSmallTile = () => {
  const bakers = useBakerList();

  return (pkh: string) => {
    const baker = bakers.find(a => a.address === pkh);
    return baker ? (
      <BakerSmallTile pkh={baker.address} label={baker.name} imageUrl={baker.logo} />
    ) : null;
  };
};
