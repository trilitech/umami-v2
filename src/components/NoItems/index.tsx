import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Box, Button, Center, Flex, Heading } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function NoItems({
  title,
  children,
  small = false,
}: {
  title: string;
  children?: React.ReactNode;
  small?: boolean;
}) {
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
}

export const NoNFTs: React.FC<{ small?: boolean }> = ({ small }) => (
  <NoItems
    title="No NFTs found"
    small={small}
    children={
      <Link to="https://objkt.com" target="_blank">
        <Button size={small ? "md" : "lg"}>Buy your first NFT</Button>
      </Link>
    }
  />
);

export const NoOperations: React.FC<{ small?: boolean }> = ({ small }) => (
  <NoItems title="No operations found" small={small} />
);

export const NoDelegations: React.FC<{ small?: boolean; onDelegate: () => void }> = ({
  small,
  onDelegate,
}) => (
  <NoItems
    title="Currently not delegating"
    children={
      <Button size={small ? "md" : "lg"} onClick={onDelegate}>
        Start delegating
      </Button>
    }
    small={small}
  />
);
