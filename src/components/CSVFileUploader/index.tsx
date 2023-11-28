import { useContext } from "react";
import { DynamicModalContext } from "../DynamicModal";
import CSVFileUploadForm from "./CSVFileUploadForm";
import { Button, Text } from "@chakra-ui/react";
import FileArrowDownIcon from "../../assets/icons/FileArrowDown";

const CSVFileUploader = () => {
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

export default CSVFileUploader;
