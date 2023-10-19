import {
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  TableContainer,
  Table,
  Tr,
  Td,
  Tbody,
  Heading,
} from "@chakra-ui/react";
import { CSSProperties } from "react";
import AddressPill from "../../../components/AddressPill/AddressPill";
import { TruncatedTextWithTooltip } from "../../../components/TruncatedTextWithTooltip";
import { TzktLink } from "../../../components/TzktLink";
import { parsePkh } from "../../../types/Address";
import { metadataUri, mimeType, royalties } from "../../../types/Token";
import { NFTBalance } from "../../../types/TokenBalance";
import { useSelectedNetwork } from "../../../utils/hooks/networkHooks";
import colors from "../../../style/colors";

const CreatorElement = ({ nft }: { nft: NFTBalance }) => {
  if (!nft.metadata.creators || nft.metadata.creators.length === 0) {
    return <>-</>;
  }
  const firstCreator = nft.metadata.creators[0];
  if (firstCreator.startsWith("tz")) {
    return <AddressPill address={parsePkh(firstCreator)} mr={1} />;
  }
  return <TruncatedTextWithTooltip text={firstCreator} maxLength={15} />;
};

const PropertiesAccordionItem = ({ nft, style }: { nft: NFTBalance; style: CSSProperties }) => {
  const royaltyShares = royalties(nft);
  const totalRoyalties = royaltyShares.reduce((acc, royalty) => acc + royalty.share, 0).toFixed(2);

  const network = useSelectedNetwork();

  return (
    <AccordionItem bg={colors.gray[800]} style={style}>
      <AccordionButton paddingY="16px">
        <Heading size="md" flex="1" textAlign="left">
          Properties
        </Heading>
        <AccordionIcon />
      </AccordionButton>

      <AccordionPanel>
        <TableContainer>
          <Table variant="stripped">
            <Tbody fontSize="14px">
              <Tr
                bg={colors.gray[900]}
                borderRadius="8px"
                borderColor={colors.gray[700]}
                borderBottomWidth="1px"
              >
                <Td
                  data-testid="nft-editions"
                  padding="16px 0 16px 15px"
                  w="20%"
                  borderTopLeftRadius="8px"
                  color={colors.gray[400]}
                  paddingRight="0"
                >
                  Editions:
                </Td>
                <Td
                  data-testid="nft-editions-value"
                  padding="16px 0 16px 5px"
                  w="30%"
                  borderColor={colors.gray[700]}
                  borderRightWidth="1px"
                >
                  {nft.totalSupply || "?"}
                </Td>

                <Td padding="16px 0 16px 15px" w="20%" color={colors.gray[400]}>
                  Token ID:
                </Td>
                <Td padding="16px 0 16px 5px" w="30%" borderTopRightRadius="8px">
                  {nft.tokenId}
                </Td>
              </Tr>
              <Tr bg={colors.gray[800]} borderColor={colors.gray[700]} borderBottomWidth="1px">
                <Td data-testid="nft-royalty" padding="16px 0 16px 15px" color={colors.gray[400]}>
                  Royalties
                  {royaltyShares.length > 1 ? " (" + royaltyShares.length + ")" : ""}:
                </Td>
                <Td
                  data-testid="nft-royalty-value"
                  padding="16px 0 16px 5px"
                  borderColor={colors.gray[700]}
                  borderRightWidth="1px"
                >
                  {royaltyShares.length > 0 ? totalRoyalties + "%" : "-"}
                </Td>
                <Td data-testid="nft-mime" padding="16px 0 16px 15px" color={colors.gray[400]}>
                  MIME type:
                </Td>
                <Td data-testid="nft-mime-value" padding="16px 0 16px 5px" w="30%">
                  {mimeType(nft) || "-"}
                </Td>
              </Tr>

              <Tr bg={colors.gray[900]} borderColor={colors.gray[700]} borderBottomWidth="1px">
                <Td padding="16px 0 16px 15px" color={colors.gray[400]}>
                  Contract:
                </Td>
                <Td padding="16px 0 16px 5px" borderColor={colors.gray[700]} borderRightWidth="1px">
                  <AddressPill address={parsePkh(nft.contract)} mr={1} />
                </Td>
                <Td padding="16px 0 16px 15px" color={colors.gray[400]}>
                  Metadata:
                </Td>
                <Td padding="16px 0 16px 5px" w="30%">
                  TzKT <TzktLink url={metadataUri(nft, network)}></TzktLink>
                </Td>
              </Tr>

              <Tr bg={colors.gray[800]} borderColor={colors.gray[700]} borderBottomWidth="1px">
                <Td data-testid="nft-creator" padding="16px 0 16px 15px" color={colors.gray[400]}>
                  Creator:
                </Td>
                <Td
                  data-testid="nft-creator-value"
                  padding="16px 0 16px 5px"
                  borderColor={colors.gray[700]}
                  borderRightWidth="1px"
                >
                  <CreatorElement nft={nft} />
                </Td>
                <Td padding="16px 0 16px 15px" color={colors.gray[400]}>
                  License:
                </Td>
                <Td padding="16px 0 16px 5px" w="30%">
                  <TruncatedTextWithTooltip text={nft.metadata.rights || "-"} maxLength={15} />
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </AccordionPanel>
    </AccordionItem>
  );
};
export default PropertiesAccordionItem;
