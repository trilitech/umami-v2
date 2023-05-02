import { Input, useToast } from "@chakra-ui/react";
import Papa from "papaparse";
import { useRef } from "react";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import { IconAndTextBtn } from "../IconAndTextBtn";
import { parseCSVRow } from "./utils";

const CSVFileUploader = () => {
  const toast = useToast();
  const fileInput = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInput.current?.click();
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileUploaded = event.target.files?.item(0);
    if (!fileUploaded) {
      throw new Error("Error uploading csv file.");
    }
    Papa.parse<string[]>(fileUploaded, {
      delimiter: ",",
      skipEmptyLines: true,
      complete: (res) => {
        if (res.errors.length > 0) {
          throw new Error("Error parsing csv file.");
        }

        const parsed = res.data.map((row, i) => {
          try {
            return parseCSVRow(row);
          } catch (error: any) {
            toast({
              title: "error",
              description: `Error at row ${i}: ${error?.message}`,
            });
          }
        });
      },
    });
  };
  return (
    <>
      <Input
        accept=".csv"
        type="file"
        onChange={handleChange}
        ref={fileInput}
        style={{ display: "none" }}
      />
      <IconAndTextBtn
        icon={HiOutlineDocumentDownload}
        label="Load CSV file"
        onClick={handleClick}
      />
    </>
  );
};

export default CSVFileUploader;
