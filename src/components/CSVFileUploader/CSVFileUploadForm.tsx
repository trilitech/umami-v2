import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  useToast,
  Text,
  Flex,
} from "@chakra-ui/react";
import Papa, { ParseResult } from "papaparse";
import { FC, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useGetAccountAssetsLookup } from "../../utils/hooks/assetsHooks";
import { ConnectedAccountSelector } from "../AccountSelector/AccountSelector";
import { CSVRow } from "./types";
import { csvRowToOperationValue, parseToCSVRow } from "./utils";

const CSVFileUploadForm: FC<{ onClose: () => void }> = ({ onClose }) => {
  const toast = useToast();
  const getAssetsLookup = useGetAccountAssetsLookup();

  const { control, handleSubmit, formState } = useForm<{
    sender: string;
  }>({
    mode: "onBlur",
  });
  const { isValid } = formState;

  // TODO: is it possible to use the csv file with react-hook-form?
  // https://app.asana.com/0/0/1204523779791382/f
  const [csv, setCSV] = useState<CSVRow[] | null>(null);
  const csvRef = useRef<HTMLInputElement>(null);

  const onCSVFileUploadComplete = async (rows: ParseResult<string[]>) => {
    if (rows.errors.length > 0) {
      throw new Error("Error loading csv file.");
    }

    // Iterate through the csv
    const csv: CSVRow[] = [];
    rows.data.forEach((row, i) => {
      try {
        csv.push(parseToCSVRow(row));
      } catch (error: any) {
        toast({
          title: "error",
          description: `Error at row ${i}: ${error?.message}`,
        });

        // Reset file input.
        if (csvRef.current) {
          csvRef.current.value = "";
        }
      }
    });

    const isValidCSV = csv.length === rows.data.length;
    setCSV(isValidCSV ? csv : null);
  };

  const handleCSVFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileUploaded = event.target.files?.item(0);
    if (!fileUploaded) {
      throw new Error("Error uploading csv file.");
    }

    Papa.parse<string[]>(fileUploaded, {
      delimiter: ",",
      skipEmptyLines: true,
      complete: onCSVFileUploadComplete,
    });
  };

  const onSubmit = async ({ sender }: { sender: string }) => {
    if (!csv) {
      return;
    }

    const assetLookup = getAssetsLookup(sender);

    // TODO: Add fa1.2 support for batch.
    // https://app.asana.com/0/1204165186238194/1204523779791384/f
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const operationValues = csv.map((csvRow) =>
      csvRowToOperationValue(sender, csvRow, assetLookup)
    );

    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <ModalCloseButton />
      <ModalHeader textAlign={"center"}>Load CSV file</ModalHeader>
      <Text textAlign="center">
        Select an account and then upload the CSV file.
      </Text>
      <ModalBody>
        <FormControl paddingY={5}>
          <FormLabel>From</FormLabel>
          <Controller
            rules={{ required: true }}
            control={control}
            name="sender"
            render={({ field: { onChange, value } }) => (
              <ConnectedAccountSelector
                selected={value}
                onSelect={(account) => {
                  onChange(account.pkh);
                }}
              />
            )}
          />
        </FormControl>

        <FormLabel pt={5}>Select CSV</FormLabel>
        <Flex>
          <Input
            p={2}
            mb={5}
            ref={csvRef}
            accept=".csv"
            type="file"
            onChange={handleCSVFileUpload}
            variant="unstyled"
          />
        </Flex>
      </ModalBody>

      <ModalFooter>
        <Box width={"100%"}>
          <Button
            isDisabled={!(isValid && !!csv)}
            width={"100%"}
            type="submit"
            mb={2}
          >
            Upload
          </Button>
        </Box>
      </ModalFooter>
    </form>
  );
};

export default CSVFileUploadForm;
