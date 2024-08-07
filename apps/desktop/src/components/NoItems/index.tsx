import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Box, Button, Center, Flex, Heading, Text } from "@chakra-ui/react";
import { type PropsWithChildren } from "react";

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

export const NoItems = ({
  title,
  description,
  children,
  size,
}: PropsWithChildren<{
  title: string;
  description: string;
  size: AvailableSizes;
}>) => (
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

export const NoOperations = ({ size }: { size: AvailableSizes }) => (
  <NoItems
    description="Your operations history will appear here..."
    size={size}
    title="No operations to show"
  />
);

export const NoNFTs = ({ size }: { size: AvailableSizes }) => (
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

export const NoTokens = ({ size }: { size: AvailableSizes }) => (
  <NoItems
    description="All of your tokens will appear here..."
    size={size}
    title="No tokens to show"
  />
);
