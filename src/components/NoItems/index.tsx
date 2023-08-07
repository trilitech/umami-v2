import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Box, Button, Center, Flex, Heading } from "@chakra-ui/react";
import { navigateToExternalLink } from "../../utils/helpers";

export default function NoItems({
  text,
  primaryText,
  onClickPrimary = () => {},
  secondaryText,
  onClickSecondary = () => {},
  small = false,
}: {
  text: string;
  primaryText?: string;
  onClickPrimary?: () => void;
  secondaryText?: string;
  onClickSecondary?: () => void;
  small?: boolean;
}) {
  const headingSize = small ? "md" : "3xl";
  const buttonSize = small ? "md" : "lg";
  return (
    <Flex width="100%" height="100%" justifyContent="center" alignItems="center">
      <Box>
        <Heading size={headingSize} p="42px">
          {text}
        </Heading>
        <Center>
          {primaryText ? (
            <Button variant="primary" size={buttonSize} onClick={onClickPrimary}>
              {primaryText}
            </Button>
          ) : null}
          {secondaryText ? (
            <Button variant="tertiary" size={buttonSize} onClick={onClickSecondary} ml={5}>
              {secondaryText}
            </Button>
          ) : null}
        </Center>
      </Box>
    </Flex>
  );
}

type ComponentWithSizeProps = React.FC<{ small?: boolean }>;

export const NoNFTs: ComponentWithSizeProps = props => (
  <NoItems
    {...props}
    text="No NFTs found"
    primaryText="Buy your first NFT"
    onClickPrimary={() => {
      navigateToExternalLink(`https://objkt.com`);
    }}
  />
);

export const NoOperations: ComponentWithSizeProps = props => (
  <NoItems {...props} text="No operations found" />
);

export const NoDelegations: React.FC<{ small?: boolean; onDelegate: () => void }> = props => (
  <NoItems
    {...props}
    text="Currently not delegating"
    primaryText="Start delegating"
    onClickPrimary={props.onDelegate}
  />
);
