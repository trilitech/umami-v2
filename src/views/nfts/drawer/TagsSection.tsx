import { Wrap, WrapItem, Text } from "@chakra-ui/react";
import { NFTBalance } from "../../../types/TokenBalance";

const TagsSection = ({ nft }: { nft: NFTBalance }) => {
  const tags = nft.metadata.tags;
  if (!tags || tags.length === 0) {
    return null;
  }
  return (
    <Wrap mt="3" data-testid="tags-section">
      {tags.map(tag => {
        return (
          <WrapItem key={tag} borderRadius="100px" padding="3px 8px" bg="umami.gray.600">
            <Text data-testid="nft-tag" color="umami.gray.400">
              {tag}
            </Text>
          </WrapItem>
        );
      })}
    </Wrap>
  );
};

export default TagsSection;
