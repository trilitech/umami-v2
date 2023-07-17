import { HiOutlineDocumentDownload } from "react-icons/hi";
import colors from "../../style/colors";
import { IconAndTextBtn } from "../IconAndTextBtn";
import useFileUploadModal from "./useCSVFileUploadModal";

const CSVFileUploader = () => {
  const { modalElement, onOpen } = useFileUploadModal();

  return (
    <>
      <IconAndTextBtn
        icon={HiOutlineDocumentDownload}
        label="Load CSV file"
        color={colors.gray[400]}
        _hover={{
          color: colors.gray[300],
        }}
        onClick={onOpen}
      />
      {modalElement}
    </>
  );
};

export default CSVFileUploader;
