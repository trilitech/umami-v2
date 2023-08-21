import { HiOutlineDocumentDownload } from "react-icons/hi";
import colors from "../../style/colors";
import { IconAndTextBtn } from "../IconAndTextBtn";
import { useContext } from "react";
import { DynamicModalContext } from "../DynamicModal";
import CSVFileUploadForm from "./CSVFileUploadForm";

const CSVFileUploader = () => {
  const { openWith } = useContext(DynamicModalContext);
  return (
    <IconAndTextBtn
      icon={HiOutlineDocumentDownload}
      label="Load CSV file"
      color={colors.gray[400]}
      _hover={{
        color: colors.gray[300],
      }}
      onClick={() => openWith(<CSVFileUploadForm />)}
    />
  );
};

export default CSVFileUploader;
