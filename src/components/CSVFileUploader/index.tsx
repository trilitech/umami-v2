import { Button, Text } from "@chakra-ui/react";
import { useContext } from "react";

import { CSVFileUploadForm } from "./CSVFileUploadForm";
import { FileArrowDownIcon } from "../../assets/icons";
import { DynamicModalContext } from "../DynamicModal";

export const CSVFileUploader = () => {
  const { openWith } = useContext(DynamicModalContext);
  return (
    <Button onClick={() => openWith(<CSVFileUploadForm />)} variant="CTAWithIcon">
      <Text marginRight="4px" size="sm">
        Load CSV file
      </Text>
      <FileArrowDownIcon stroke="currentcolor" />
    </Button>
  );
};
