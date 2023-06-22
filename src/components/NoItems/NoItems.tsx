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
    <Flex width="100%" height="100%" alignContent="center" justifyContent="center">
      <Center>
        <Box>
          <Heading size={headingSize} p="42px">
            {text}
          </Heading>
          <Center>
            {primaryText ? (
              <Button bg="umami.blue" size={buttonSize} mr="16px" onClick={onClickPrimary}>
                {primaryText}
              </Button>
            ) : null}
            {secondaryText ? (
              <Button variant="outline" size={buttonSize} onClick={onClickSecondary}>
                {secondaryText}
              </Button>
            ) : null}
          </Center>
        </Box>
      </Center>
    </Flex>
  );
}

type ComponentWithSizeProps = React.FC<{ small?: boolean }>;

export const NoNFTS: ComponentWithSizeProps = props => (
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

export const NoDelegations: ComponentWithSizeProps = props => (
  <NoItems text="Currently not delegating" primaryText="Start delegating" />
);
