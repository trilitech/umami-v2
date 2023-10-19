import { Box, Button, Center, Flex, Heading, Text } from "@chakra-ui/react";
import React, { useContext } from "react";
import CSVFileUploader from "../../components/CSVFileUploader";
import { TopBar } from "../../components/TopBar";
import colors from "../../style/colors";
import { BatchView } from "./BatchView";
import { DynamicModalContext } from "../../components/DynamicModal";
import SendTezForm from "../../components/SendFlow/Tez/FormPage";
import CSVFileUploadForm from "../../components/CSVFileUploader/CSVFileUploadForm";
import { useBatches } from "../../utils/hooks/batchesHooks";
import ExternalLinkIcon from "../../assets/icons/ExternalLink";
import { ExternalLink } from "../../components/ExternalLink";

export const FilterController = ({ batchPending }: { batchPending: number }) => {
  return (
    <Flex alignItems="center" mb="24px" mt="24px">
      <Heading size="sm" color={colors.orangeL} flex={1}>
        {batchPending} Pending
      </Heading>
      <CSVFileUploader />
      <ExternalLink
        ml="8px"
        href="https://github.com/trilitech/umami-v2/blob/main/doc/Batch-File-Format-Specifications.md"
      >
        <Button variant="CTAWithIcon" paddingRight="0">
          <Text mr="4px" size="sm">
            See file specs
          </Text>
          <ExternalLinkIcon stroke="currentcolor" />
        </Button>
      </ExternalLink>
    </Flex>
  );
};

const BatchPage = () => {
  const batches = useBatches();

  return (
    <Flex direction="column" height="100%">
      <TopBar title="Batch" />
      <FilterController batchPending={batches.length} />
      <Box overflowY="auto" minH="80%">
        {batches.length > 0 ? (
          batches.map(operations => (
            <BatchView key={operations.sender.address.pkh} operations={operations} />
          ))
        ) : (
          <EmptyBatch />
        )}
      </Box>
    </Flex>
  );
};

const EmptyBatch = () => {
  const { openWith } = useContext(DynamicModalContext);

  return (
    <Center height="100%" textAlign="center">
      <Box>
        <Heading size="3xl">No 'batch' to show</Heading>
        <Text color={colors.gray[400]} mt="10px" size="xl">
          There is no batch transaction to show...
        </Text>
        <Flex justifyContent="space-around" mt="30px">
          <Box>
            <Button onClick={() => openWith(<SendTezForm />)}>Start a Batch</Button>
            <Button ml="15px" variant="tertiary" onClick={() => openWith(<CSVFileUploadForm />)}>
              Load CSV file
            </Button>
          </Box>
        </Flex>
      </Box>
    </Center>
  );
};

export default BatchPage;
