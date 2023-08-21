import { Box, Flex, Heading } from "@chakra-ui/react";
import React, { useContext } from "react";
import { TfiNewWindow } from "react-icons/tfi";
import CSVFileUploader from "../../components/CSVFileUploader";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import { TopBar } from "../../components/TopBar";
import colors from "../../style/colors";
import { navigateToExternalLink } from "../../utils/helpers";
import { BatchDisplay } from "./BatchDisplay";
import NoItems from "../../components/NoItems";
import { DynamicModalContext } from "../../components/DynamicModal";
import SendTezForm from "../../components/SendFlow/Tez/FormPage";
import CSVFileUploadForm from "../../components/CSVFileUploader/CSVFileUploadForm";
import { useBatches } from "../../utils/hooks/assetsHooks";

export const FilterController: React.FC<{ batchPending: number }> = props => {
  return (
    <Flex alignItems="center" mb={4} mt={4}>
      <Heading size="sm" color={colors.orangeL} flex={1}>
        {props.batchPending} Pending
      </Heading>
      <CSVFileUploader />
      <IconAndTextBtn
        ml={4}
        icon={TfiNewWindow}
        label="See file specs"
        color={colors.gray[400]}
        _hover={{
          color: colors.gray[300],
        }}
        onClick={() => {
          navigateToExternalLink(
            "https://github.com/trilitech/umami-v2/blob/main/doc/Batch-File-Format-Specifications.md"
          );
        }}
      />
    </Flex>
  );
};

const BatchView = () => {
  const batches = useBatches();

  const { openWith } = useContext(DynamicModalContext);

  return (
    <Flex direction="column" height="100%">
      <TopBar title="Batch" />
      <FilterController batchPending={batches.length} />
      <Box overflowY="auto" minH="80%">
        {batches.length > 0 ? (
          batches.map(operations => (
            <BatchDisplay
              key={operations.sender.address.pkh}
              account={operations.sender}
              operations={operations}
            />
          ))
        ) : (
          <NoItems
            text="Your batch is currently empty"
            primaryText="Start a Batch"
            onClickPrimary={() => openWith(<SendTezForm />)}
            secondaryText="Load CSV file"
            onClickSecondary={() => openWith(<CSVFileUploadForm />)}
          />
        )}
      </Box>
    </Flex>
  );
};

export default BatchView;
