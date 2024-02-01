import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useContext } from "react";

import { BatchView } from "./BatchView";
import { ExternalLinkIcon } from "../../assets/icons";
import { CSVFileUploader } from "../../components/CSVFileUploader";
import { CSVFileUploadForm } from "../../components/CSVFileUploader/CSVFileUploadForm";
import { DynamicModalContext } from "../../components/DynamicModal";
import { ExternalLink } from "../../components/ExternalLink";
import { NoBatches } from "../../components/NoItems";
import { FormPage as SendTezForm } from "../../components/SendFlow/Tez/FormPage";
import { TopBar } from "../../components/TopBar";
import colors from "../../style/colors";
import { useBatches } from "../../utils/hooks/batchesHooks";

const FilterController = ({ batchPending }: { batchPending: number }) => {
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
  const { openWith } = useContext(DynamicModalContext);

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
          <NoBatches
            onLoadCSV={() => openWith(<CSVFileUploadForm />)}
            onStartBatch={() => openWith(<SendTezForm showPreview={false} />)}
          />
        )}
      </Box>
    </Flex>
  );
};
