import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  type AccordionProps,
  Flex,
  type FlexProps,
  Heading,
  Icon,
  Link,
  Text,
} from "@chakra-ui/react";
import { type NFTBalance, metadataUri, mimeType, royalties } from "@umami/core";
import { useSelectedNetwork } from "@umami/state";
import { parsePkh } from "@umami/tezos";
import { type PropsWithChildren } from "react";

import { AddressPill } from "../../../components/AddressPill/AddressPill";
import { useColor } from "../../../styles/useColor";
// import { TruncatedTextWithTooltip } from "../../../components/TruncatedTextWithTooltip";

const CreatorElement = ({ nft }: { nft: NFTBalance }) => {
  if (!nft.metadata.creators || nft.metadata.creators.length === 0) {
    return <>-</>;
  }
  const firstCreator = nft.metadata.creators[0];
  if (firstCreator.startsWith("tz")) {
    return <AddressPill marginRight={1} address={parsePkh(firstCreator)} />;
  }
  // TODO: May need truncation
  return <Text>{firstCreator}</Text>;
};

const Row = ({ label, children, ...props }: PropsWithChildren<{ label: string }> & FlexProps) => {
  const color = useColor();
  return (
    <Flex
      alignItems="center"
      justifyContent="space-between"
      padding="12px"
      borderTop="1px dashed"
      borderTopColor={color("100")}
      {...props}
    >
      <Heading color={color("900")} size="sm">
        {label}
      </Heading>
      {children}
    </Flex>
  );
};

export const PropertiesAccordion = ({ nft, ...props }: { nft: NFTBalance } & AccordionProps) => {
  const color = useColor();
  const royaltyShares = royalties(nft);
  const totalRoyalties = royaltyShares.reduce((acc, royalty) => acc + royalty.share, 0).toFixed(2);

  const network = useSelectedNetwork();

  return (
    <Accordion allowToggle {...props}>
      <AccordionItem>
        <AccordionButton>
          <Heading flex="1" color={color("900")} textAlign="left" size="lg">
            Properties
          </Heading>
          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel>
          <Row data-testid="nft-editions" label="Editions">
            {nft.totalSupply || "?"}
          </Row>

          <Row label="Token ID">{nft.tokenId}</Row>

          <Row
            data-testid="nft-royalty"
            label={`Royalties${royaltyShares.length > 1 ? " (" + royaltyShares.length + ")" : ""}`}
          >
            {royaltyShares.length > 0 ? totalRoyalties + "%" : "-"}
          </Row>

          <Row data-testid="nft-mime" label="MIME type">
            {mimeType(nft) || "-"}
          </Row>

          <Row data-testid="nft-contract" label="Contract">
            <AddressPill address={parsePkh(nft.contract)} />
          </Row>

          <Row data-testid="nft-metadata" label="Metadata">
            <Flex gap="4px">
              <Text>TzKT</Text>
              <Link data-testid="nft-metadata-link" href={metadataUri(nft, network)} isExternal>
                <Icon as={ExternalLinkIcon} display="flex" height="full" color={color("400")} />
              </Link>
            </Flex>
          </Row>

          <Row data-testid="nft-creator" label="Creator">
            <CreatorElement nft={nft} />
          </Row>

          <Row borderBottom="1px dashed" borderBottomColor={color("100")} label="License">
            {nft.metadata.rights || "-"}
          </Row>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
