import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tr,
} from "@chakra-ui/react";
import { CSSProperties } from "react";

import { AddressPill } from "../../../components/AddressPill/AddressPill";
import { TruncatedTextWithTooltip } from "../../../components/TruncatedTextWithTooltip";
import { TzktLink } from "../../../components/TzktLink";
import colors from "../../../style/colors";
import { parsePkh } from "../../../types/Address";
import { metadataUri, mimeType, royalties } from "../../../types/Token";
import { NFTBalance } from "../../../types/TokenBalance";
import { useSelectedNetwork } from "../../../utils/hooks/networkHooks";

const CreatorElement = ({ nft }: { nft: NFTBalance }) => {
  if (!nft.metadata.creators || nft.metadata.creators.length === 0) {
    return <>-</>;
  }
  const firstCreator = nft.metadata.creators[0];
  if (firstCreator.startsWith("tz")) {
    return <AddressPill marginRight={1} address={parsePkh(firstCreator)} />;
  }
  return <TruncatedTextWithTooltip maxLength={15} text={firstCreator} />;
};

export const PropertiesAccordionItem = ({
  nft,
  style,
}: {
  nft: NFTBalance;
  style: CSSProperties;
}) => {
  const royaltyShares = royalties(nft);
  const totalRoyalties = royaltyShares.reduce((acc, royalty) => acc + royalty.share, 0).toFixed(2);

  const network = useSelectedNetwork();

  return (
    <AccordionItem background={colors.gray[800]} style={style}>
      <AccordionButton paddingY="16px">
        <Heading flex="1" textAlign="left" size="md">
          Properties
        </Heading>
        <AccordionIcon />
      </AccordionButton>

      <AccordionPanel>
        <TableContainer>
          <Table variant="stripped">
            <Tbody fontSize="14px">
              <Tr
                background={colors.gray[900]}
                borderColor={colors.gray[700]}
                borderBottomWidth="1px"
                borderRadius="8px"
              >
                <Td
                  width="20%"
                  padding="16px 0 16px 15px"
                  paddingRight="0"
                  color={colors.gray[400]}
                  borderTopLeftRadius="8px"
                  data-testid="nft-editions"
                >
                  Editions:
                </Td>
                <Td
                  width="30%"
                  padding="16px 0 16px 5px"
                  borderColor={colors.gray[700]}
                  borderRightWidth="1px"
                  data-testid="nft-editions-value"
                >
                  {nft.totalSupply || "?"}
                </Td>

                <Td width="20%" padding="16px 0 16px 15px" color={colors.gray[400]}>
                  Token ID:
                </Td>
                <Td width="30%" padding="16px 0 16px 5px" borderTopRightRadius="8px">
                  {nft.tokenId}
                </Td>
              </Tr>
              <Tr
                background={colors.gray[800]}
                borderColor={colors.gray[700]}
                borderBottomWidth="1px"
              >
                <Td padding="16px 0 16px 15px" color={colors.gray[400]} data-testid="nft-royalty">
                  Royalties
                  {royaltyShares.length > 1 ? " (" + royaltyShares.length + ")" : ""}:
                </Td>
                <Td
                  padding="16px 0 16px 5px"
                  borderColor={colors.gray[700]}
                  borderRightWidth="1px"
                  data-testid="nft-royalty-value"
                >
                  {royaltyShares.length > 0 ? totalRoyalties + "%" : "-"}
                </Td>
                <Td padding="16px 0 16px 15px" color={colors.gray[400]} data-testid="nft-mime">
                  MIME type:
                </Td>
                <Td width="30%" padding="16px 0 16px 5px" data-testid="nft-mime-value">
                  {mimeType(nft) || "-"}
                </Td>
              </Tr>

              <Tr
                background={colors.gray[900]}
                borderColor={colors.gray[700]}
                borderBottomWidth="1px"
              >
                <Td padding="16px 0 16px 15px" color={colors.gray[400]}>
                  Contract:
                </Td>
                <Td padding="16px 0 16px 5px" borderColor={colors.gray[700]} borderRightWidth="1px">
                  <AddressPill marginRight={1} address={parsePkh(nft.contract)} />
                </Td>
                <Td padding="16px 0 16px 15px" color={colors.gray[400]}>
                  Metadata:
                </Td>
                <Td width="30%" padding="16px 0 16px 5px">
                  TzKT <TzktLink url={metadataUri(nft, network)}></TzktLink>
                </Td>
              </Tr>

              <Tr
                background={colors.gray[800]}
                borderColor={colors.gray[700]}
                borderBottomWidth="1px"
              >
                <Td padding="16px 0 16px 15px" color={colors.gray[400]} data-testid="nft-creator">
                  Creator:
                </Td>
                <Td
                  padding="16px 0 16px 5px"
                  borderColor={colors.gray[700]}
                  borderRightWidth="1px"
                  data-testid="nft-creator-value"
                >
                  <CreatorElement nft={nft} />
                </Td>
                <Td padding="16px 0 16px 15px" color={colors.gray[400]}>
                  License:
                </Td>
                <Td width="30%" padding="16px 0 16px 5px">
                  <TruncatedTextWithTooltip maxLength={15} text={nft.metadata.rights || "-"} />
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </AccordionPanel>
    </AccordionItem>
  );
};
