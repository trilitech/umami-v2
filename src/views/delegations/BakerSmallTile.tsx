import { AspectRatio, Image, Flex, Box, Text } from "@chakra-ui/react";
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
        <Text>{label}</Text>
        <Text color="umami.gray.600">{formatPkh(pkh)}</Text>
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
