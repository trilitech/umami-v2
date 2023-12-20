import { Box, Button, Center, Flex, Heading, Text } from "@chakra-ui/react";
import { useContext } from "react";

import { BatchView } from "./BatchView";
import { ExternalLinkIcon } from "../../assets/icons";
import { CSVFileUploader } from "../../components/CSVFileUploader";
import { CSVFileUploadForm } from "../../components/CSVFileUploader/CSVFileUploadForm";
import { DynamicModalContext } from "../../components/DynamicModal";
import { ExternalLink } from "../../components/ExternalLink";
import { FormPage as SendTezForm } from "../../components/SendFlow/Tez/FormPage";
import { TopBar } from "../../components/TopBar";
import colors from "../../style/colors";
import { useBatches } from "../../utils/hooks/batchesHooks";

export const FilterController = ({ batchPending }: { batchPending: number }) => {
  return (
    <Flex alignItems="center" marginTop="24px" marginBottom="24px">
      <Heading flex={1} color={colors.orangeL} size="sm">
        {batchPending} Pending
      </Heading>
      <CSVFileUploader />
      <ExternalLink
        marginLeft="8px"
        href="https://github.com/trilitech/umami-v1/blob/main/CSV_FILE_SPEC.md"
      >
        <Button paddingRight="0" variant="CTAWithIcon">
          <Text marginRight="4px" size="sm">
            See file specs
          </Text>
          <ExternalLinkIcon stroke="currentcolor" />
        </Button>
      </ExternalLink>
    </Flex>
  );
};

export const BatchPage = () => {
  const batches = useBatches();

  return (
    <Flex flexDirection="column" height="100%">
      <TopBar title="Batch" />
      <FilterController batchPending={batches.length} />
      <Box overflowY="auto" minHeight="80%">
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
        <Text marginTop="10px" color={colors.gray[400]} size="xl">
          There is no batch transaction to show...
        </Text>
        <Flex justifyContent="space-around" marginTop="30px">
          <Box>
            <Button onClick={() => openWith(<SendTezForm showPreview={false} />)}>
              Start a Batch
            </Button>
            <Button
              marginLeft="15px"
              onClick={() => openWith(<CSVFileUploadForm />)}
              variant="tertiary"
            >
              Load CSV file
            </Button>
          </Box>
        </Flex>
      </Box>
    </Center>
  );
};
