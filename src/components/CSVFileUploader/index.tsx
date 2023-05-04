import { HiOutlineDocumentDownload } from "react-icons/hi";
import { IconAndTextBtn } from "../IconAndTextBtn";
import useFileUploadModal from "./useCSVFileUploadModal";

const CSVFileUploader = () => {
  const { modalElement, onOpen } = useFileUploadModal();

  return (
    <>
      <IconAndTextBtn
        icon={HiOutlineDocumentDownload}
        label="Load CSV file"
        onClick={onOpen}
      />
      {modalElement}
    </>
  );
};

export default CSVFileUploader;
