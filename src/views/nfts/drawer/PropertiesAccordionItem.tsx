import {
  AccordionItem,
  AccordionButton,
  Box,
  AccordionIcon,
  AccordionPanel,
  TableContainer,
  Table,
  Tr,
  Td,
  Tbody,
} from "@chakra-ui/react";
import { CSSProperties } from "react";
import { mimeType, NFT, royalties } from "../../../types/Asset";

const PropertiesAccordionItem = ({
  nft,
  style,
}: {
  nft: NFT;
  style: CSSProperties;
}) => {
  const royaltyShares = royalties(nft);
  const totalRoyalties = royaltyShares
    .reduce((acc, royalty) => acc + royalty.share, 0)
    .toFixed(2);
  return (
    <AccordionItem bg="umami.gray.800" style={style}>
      <h2>
        <AccordionButton>
          <Box as="span" flex="1" textAlign="left">
            Properties
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel>
        <TableContainer>
          <Table variant="stripped">
            <Tbody fontSize="14px">
              {/* TODO finish! */}
              <Tr
                bg="umami.gray.900"
                borderRadius="8px"
                borderColor="umami.gray.700"
                borderBottomWidth="1px"
              >
                <Td
                  padding="16px 0 16px 15px"
                  w="20%"
                  borderTopLeftRadius="8px"
                  color="umami.gray.400"
                  paddingRight="0"
                >
                  Editions:
                </Td>
                <Td
                  padding="16px 0 16px 5px"
                  w="30%"
                  borderColor="umami.gray.700"
                  borderRightWidth="1px"
                >
                  TBD
                </Td>
                <Td padding="16px 0 16px 15px" w="20%" color="umami.gray.400">
                  Owned:
                </Td>
                <Td
                  padding="16px 0 16px 5px"
                  w="30%"
                  borderTopRightRadius="8px"
                >
                  TBD
                </Td>
              </Tr>
              <Tr
                bg="umami.gray.800"
                borderColor="umami.gray.700"
                borderBottomWidth="1px"
              >
                <Td
                  data-testid="nft-royalty"
                  padding="16px 0 16px 15px"
                  color="umami.gray.400"
                >
                  Royalties
                  {royaltyShares.length > 1
                    ? " (" + royaltyShares.length + ")"
                    : ""}
                  :
                </Td>
                <Td
                  data-testid="nft-royalty-value"
                  padding="16px 0 16px 5px"
                  borderColor="umami.gray.700"
                  borderRightWidth="1px"
                >
                  {royaltyShares.length > 0 ? totalRoyalties + "%" : "-"}
                </Td>
                <Td
                  data-testid="nft-mime"
                  padding="16px 0 16px 15px"
                  color="umami.gray.400"
                >
                  MIME type:
                </Td>
                <Td
                  data-testid="nft-mime-value"
                  padding="16px 0 16px 5px"
                  w="30%"
                >
                  {mimeType(nft) || "-"}
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
