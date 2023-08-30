import { AspectRatio, Image, Flex, Box, Text, Heading } from "@chakra-ui/react";
import colors from "../../style/colors";
import { formatPkh } from "../../utils/format";
import { useGetBaker, useGetBakerFor } from "../../utils/hooks/assetsHooks";
import { Account } from "../../types/Account";
import { RawPkh } from "../../types/Address";

type Mode = { type: "bakerPkh"; pkh: RawPkh } | { type: "delegatorAccount"; account: Account };

export const BakerSmallTile: React.FC<{ mode: Mode }> = ({ mode }) => {
  const getBakerFor = useGetBakerFor();
  const getBaker = useGetBaker();
  const bakerAddress = mode.type === "bakerPkh" ? mode.pkh : getBakerFor(mode.account)?.address;
  const baker = bakerAddress ? getBaker(bakerAddress) : undefined;

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
        {/* TODO: handle the case when the image doesn't render  */}
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

//TODO: Remove this once fillstep is removed
export const OldBakerSmallTile = ({ pkh }: { pkh: RawPkh }) => {
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
