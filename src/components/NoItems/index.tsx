import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Box, Button, Center, Flex, Heading, Text } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";

import colors from "../../style/colors";
import { ExternalLink } from "../ExternalLink";

export const NoItems: React.FC<
  PropsWithChildren<{
    title: string;
    description: string;
    small?: boolean;
  }>
> = ({ title, description, children, small = false }) => {
  const headingSize = small ? "xl" : "3xl";
  const descriptionSize = small ? "md" : "xl";
  return (
    <Flex alignItems="center" justifyContent="center" width="100%" height="100%">
      <Box padding="30px">
        <Heading marginBottom="10px" textAlign="center" size={headingSize}>
          {title}
        </Heading>
        <Text
          marginBottom="30px"
          color={colors.gray[400]}
          textAlign="center"
          size={descriptionSize}
        >
          {description}
        </Text>
        <Center>{children}</Center>
      </Box>
    </Flex>
  );
};

const buttonSize = (small = false) => (small ? "md" : "lg");

export const NoOperations: React.FC<{ small?: boolean }> = ({
  small,
}) => (
  <NoItems
    description="Your operations history will appear here..."
    small={small}
    title="No operations to show"
  >
    <Link to="/operations">
      <Button size={buttonSize(small)}>View All Operations</Button>
    </Link>
  </NoItems>
);

export const NoNFTs: React.FC<{ small?: boolean }> = ({ small }) => (
  <NoItems
    description="Your NFT collection will appear here..."
    small={small}
    title="No NFTs to show"
  >
    <ExternalLink href="https://objkt.com">
      <Button size={buttonSize(small)}>Buy your first NFT</Button>
    </ExternalLink>
  </NoItems>
);

export const NoTokens: React.FC<{ small?: boolean }> = ({ small }) => (
  <NoItems
    description="All of your tokens will appear here..."
    small={small}
    title="No tokens to show"
  />
);

export const NoDelegations: React.FC<{ small?: boolean; onDelegate: () => void }> = ({
  small,
  onDelegate,
}) => (
  <NoItems
    description="Your delegation history will appear here..."
    small={small}
    title="No delegations to show"
  >
    <Button onClick={onDelegate} size={buttonSize(small)}>
      Delegate
    </Button>
  </NoItems>
);
