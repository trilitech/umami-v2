import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Box, Button, Center, Flex, Heading, Text } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

import colors from "../../style/colors";
import { ExternalLink } from "../ExternalLink";

const SIZES = {
  md: {
    heading: "xl",
    description: "md",
    button: "md",
  },
  lg: {
    heading: "3xl",
    description: "xl",
    button: "lg",
  },
};
type AvailableSizes = keyof typeof SIZES;

export const NoItems: React.FC<
  PropsWithChildren<{
    title: string;
    description: string;
    size: AvailableSizes;
  }>
> = ({ title, description, children, size }) => {
  return (
    <Flex alignItems="center" justifyContent="center" width="100%" height="100%">
      <Box padding="30px" data-testid="empty-state-message">
        <Heading marginBottom="10px" textAlign="center" size={SIZES[size].heading}>
          {title}
        </Heading>
        <Text
          marginBottom="30px"
          color={colors.gray[400]}
          textAlign="center"
          size={SIZES[size].description}
        >
          {description}
        </Text>
        <Center>{children}</Center>
      </Box>
    </Flex>
  );
};

export const NoOperations: React.FC<{ size: AvailableSizes }> = ({ size }) => (
  <NoItems
    description="Your operations history will appear here..."
    size={size}
    title="No operations to show"
  />
);

export const NoNFTs: React.FC<{ size: AvailableSizes }> = ({ size }) => (
  <NoItems
    description="Your NFT collection will appear here..."
    size={size}
    title="No NFTs to show"
  >
    <ExternalLink data-testid="buy-nft-button" href="https://objkt.com">
      <Button size={SIZES[size].button}>Buy your first NFT</Button>
    </ExternalLink>
  </NoItems>
);

export const NoTokens: React.FC<{ size: AvailableSizes }> = ({ size }) => (
  <NoItems
    description="All of your tokens will appear here..."
    size={size}
    title="No tokens to show"
  />
);

export const NoDelegations: React.FC<{ size: AvailableSizes; onDelegate: () => void }> = ({
  size = "lg",
  onDelegate,
}) => (
  <NoItems
    description="Your delegation history will appear here..."
    size={size}
    title="No delegations to show"
  >
    <Button
      data-testid="delegation-empty-state-button"
      onClick={onDelegate}
      size={SIZES[size].button}
    >
      Delegate
    </Button>
  </NoItems>
);
