import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Box, Button, Center, Flex, Heading } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { ExternalLink } from "../ExternalLink";

const NoItems: React.FC<
  PropsWithChildren<{
    title: string;
    small?: boolean;
  }>
> = ({ title, children, small = false }) => {
  const headingSize = small ? "md" : "3xl";
  return (
    <Flex alignItems="center" justifyContent="center" width="100%" height="100%">
      <Box>
        <Heading padding="42px" size={headingSize}>
          {title}
        </Heading>
        <Center>{children}</Center>
      </Box>
    </Flex>
  );
};

export default NoItems;

export const NoNFTs: React.FC<{ small?: boolean }> = ({ small }) => (
  <NoItems small={small} title="No NFTs found">
    <ExternalLink href="https://objkt.com">
      <Button size={small ? "md" : "lg"}>Buy your first NFT</Button>
    </ExternalLink>
  </NoItems>
);

export const NoOperations: React.FC<{ small?: boolean }> = ({ small }) => (
  <NoItems small={small} title="No operations found" />
);

export const NoDelegations: React.FC<{ small?: boolean; onDelegate: () => void }> = ({
  small,
  onDelegate,
}) => (
  <NoItems small={small} title="Currently not delegating">
    <Button onClick={onDelegate} size={small ? "md" : "lg"}>
      Start delegating
    </Button>
  </NoItems>
);
