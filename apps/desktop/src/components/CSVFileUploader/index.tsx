import { Button, Text } from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";

import { CSVFileUploadForm } from "./CSVFileUploadForm";
import { FileArrowDownIcon } from "../../assets/icons";

export const CSVFileUploader = () => {
  const { openWith } = useDynamicModalContext();
  return (
    <Button onClick={() => openWith(<CSVFileUploadForm />)} variant="CTAWithIcon">
      <Text marginRight="4px" size="sm">
        Load CSV file
      </Text>
      <FileArrowDownIcon stroke="currentcolor" />
    </Button>
  );
};
