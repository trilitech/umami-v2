import { Wrap, WrapItem, Text } from "@chakra-ui/react";
import { NFTBalance } from "../../../types/TokenBalance";
import colors from "../../../style/colors";

const TagsSection = ({ nft }: { nft: NFTBalance }) => {
  const tags = nft.metadata.tags;
  if (!tags || tags.length === 0) {
    return null;
  }
  return (
    <Wrap marginTop="20px" data-testid="tags-section">
      {tags.map(tag => {
        return (
          <WrapItem key={tag} borderRadius="100px" padding="3px 8px" bg={colors.gray[600]}>
            <Text data-testid="nft-tag" color={colors.gray[400]}>
              {tag}
            </Text>
          </WrapItem>
        );
      })}
    </Wrap>
  );
};

export default TagsSection;
