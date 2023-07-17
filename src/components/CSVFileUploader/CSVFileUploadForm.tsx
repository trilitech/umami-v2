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
  FormErrorMessage,
} from "@chakra-ui/react";
import Papa, { ParseResult } from "papaparse";
import { FC, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useGetPk } from "../../utils/hooks/accountHooks";
import { useBatchIsSimulating, useSelectedNetwork } from "../../utils/hooks/assetsHooks";
import { useGetToken } from "../../utils/hooks/tokensHooks";
import { useAppDispatch } from "../../utils/store/hooks";
import { estimateAndUpdateBatch } from "../../utils/store/thunks/estimateAndupdateBatch";
import { OwnedImplicitAccountsAutocomplete } from "../AddressAutocomplete";
import { CSVRow } from "./types";
import { csvRowToOperationValue, parseToCSVRow } from "./utils";

const CSVFileUploadForm: FC<{ onClose: () => void }> = ({ onClose }) => {
  const network = useSelectedNetwork();
  const toast = useToast();
  const getPk = useGetPk();
  const getToken = useGetToken(network);
  const dispatch = useAppDispatch();
  const isSimulating = useBatchIsSimulating();

  const form = useForm<{
    sender: string;
  }>({
    mode: "onBlur",
  });
  const {
    handleSubmit,
    getValues,
    formState: { isValid, errors },
  } = form;

  // TODO: is it possible to use the csv file with react-hook-form?
  // https://app.asana.com/0/0/1204523779791382/f
  const [csv, setCSV] = useState<CSVRow[] | null>(null);
  const csvRef = useRef<HTMLInputElement>(null);

  const resetFile = () => {
    // Reset file input.
    if (csvRef.current) {
      csvRef.current.value = "";
    }
  };

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
        resetFile();
        toast({
          title: "error",
          description: `Error at row ${i}: ${error?.message}`,
        });
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
      skipEmptyLines: true,
      complete: onCSVFileUploadComplete,
    });
  };

  const onSubmit = async ({ sender }: { sender: string }) => {
    if (!csv) {
      return;
    }

    try {
      const operations = csv.map(csvRow => csvRowToOperationValue(sender, csvRow, getToken));

      await dispatch(estimateAndUpdateBatch(sender, getPk(sender), operations, network));

      toast({ title: "CSV added to batch!" });
      onClose();
    } catch (error: any) {
      resetFile();
      toast({ title: "Invalid transaction", description: error.message });
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalCloseButton />
        <ModalHeader textAlign="center">Load CSV file</ModalHeader>
        <Text textAlign="center">Select an account and then upload the CSV file.</Text>
        <ModalBody>
          <FormControl paddingY={5} isInvalid={!!errors.sender}>
            {/* TODO: Use AllAccountsAutocomplete instead */}
            <OwnedImplicitAccountsAutocomplete
              label="From"
              inputName="sender"
              allowUnknown={false}
            />
            {errors.sender && <FormErrorMessage>{errors.sender.message}</FormErrorMessage>}
          </FormControl>

          <FormLabel pt={5}>Select CSV</FormLabel>
          <Flex>
            <Input
              p={2}
              mb={5}
              ref={csvRef}
              accept=".csv"
              type="file"
              onChange={e => {
                try {
                  handleCSVFileUpload(e);
                } catch (error: any) {
                  resetFile();
                  toast({
                    title: "Error loading csv file",
                    description: error.message,
                  });
                }
              }}
              variant="unstyled"
            />
          </Flex>
        </ModalBody>

        <ModalFooter>
          <Box width="100%">
            <Button
              isDisabled={!(isValid && !!csv)}
              isLoading={isSimulating(getValues("sender"))}
              width="100%"
              type="submit"
              mb={2}
            >
              Upload
            </Button>
          </Box>
        </ModalFooter>
      </form>
    </FormProvider>
  );
};

export default CSVFileUploadForm;
