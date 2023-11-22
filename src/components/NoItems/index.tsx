import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Box, Button, Center, Flex, Heading } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { PropsWithChildren } from "react";

const NoItems: React.FC<
  PropsWithChildren<{
    title: string;
    small?: boolean;
  }>
> = ({ title, children, small = false }) => {
  const headingSize = small ? "md" : "3xl";
  return (
    <Flex width="100%" height="100%" justifyContent="center" alignItems="center">
      <Box>
        <Heading size={headingSize} p="42px">
          {title}
        </Heading>
        <Center>{children}</Center>
      </Box>
    </Flex>
  );
};

export default NoItems;

export const NoNFTs: React.FC<{ small?: boolean }> = ({ small }) => (
  <NoItems title="No NFTs found" small={small}>
    <Link to="https://objkt.com" target="_blank">
      <Button size={small ? "md" : "lg"}>Buy your first NFT</Button>
    </Link>
  </NoItems>
);

export const NoOperations: React.FC<{ small?: boolean }> = ({ small }) => (
  <NoItems title="No operations found" small={small} />
);

export const NoDelegations: React.FC<{ small?: boolean; onDelegate: () => void }> = ({
  small,
  onDelegate,
}) => (
  <NoItems title="Currently not delegating" small={small}>
    <Button size={small ? "md" : "lg"} onClick={onDelegate}>
      Start delegating
    </Button>
  </NoItems>
);
