import colors from "../../style/colors";
import { useContext } from "react";
import { DynamicModalContext } from "../DynamicModal";
import CSVFileUploadForm from "./CSVFileUploadForm";
import { Button, Text } from "@chakra-ui/react";
import FileArrowDownIcon from "../../assets/icons/FileArrowDown";

const CSVFileUploader = () => {
  const { openWith } = useContext(DynamicModalContext);
  return (
    <Button variant="unstyled" display="flex" onClick={() => openWith(<CSVFileUploadForm />)}>
      <Text mr="4px" size="sm" color={colors.gray[400]}>
        Load CSV file
      </Text>
      <FileArrowDownIcon />
    </Button>
  );
};

export default CSVFileUploader;
