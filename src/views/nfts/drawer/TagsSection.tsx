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
          <WrapItem key={tag} padding="3px 8px" background={colors.gray[600]} borderRadius="100px">
            <Text color={colors.gray[400]} data-testid="nft-tag">
              {tag}
            </Text>
          </WrapItem>
        );
      })}
    </Wrap>
  );
};

export default TagsSection;
