import { Flex, Icon, Text, Wrap, WrapItem } from "@chakra-ui/react";
import { type NFTBalance } from "@umami/core";

import { TagIcon } from "../../../assets/icons";
import { useColor } from "../../../styles/useColor";

export const TagsSection = ({ nft }: { nft: NFTBalance }) => {
  const color = useColor();
  let tags = nft.metadata.tags;
  if (!tags?.length) {
    return null;
  }

  tags = tags.filter(tag => tag.trim());

  return (
    <Wrap marginTop="20px" data-testid="tags-section">
      {tags.map(tag => (
        <WrapItem key={tag} padding="6px" background={color("100")} borderRadius="6px">
          <Flex gap="4px" data-testid="nft-tag">
            <Icon as={TagIcon} width="18px" height="18px" color={color("400")} />
            <Text color={color("700")} size="sm">
              {tag}
            </Text>
          </Flex>
        </WrapItem>
      ))}
    </Wrap>
  );
};
