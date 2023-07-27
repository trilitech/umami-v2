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
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Account } from "../../types/Account";
import { Operation } from "../../types/Operation";
import { RawPkh } from "../../types/Address";
import { useGetBestSignerForAccount, useGetOwnedAccount } from "../../utils/hooks/accountHooks";
import { useSelectedNetwork } from "../../utils/hooks/assetsHooks";
import { useGetToken } from "../../utils/hooks/tokensHooks";
import { useAppDispatch } from "../../utils/redux/hooks";
import { estimateAndUpdateBatch } from "../../utils/redux/thunks/estimateAndUpdateBatch";
import { OwnedAccountsAutocomplete } from "../AddressAutocomplete";
import { parseOperation } from "./utils";
import { makeFormOperations } from "../sendForm/types";

type FormFields = {
  sender: RawPkh;
  file: FileList;
};

const CSVFileUploadForm = ({ onClose }: { onClose: () => void }) => {
  const network = useSelectedNetwork();
  const toast = useToast();
  const getToken = useGetToken();
  const dispatch = useAppDispatch();
  const getAccount = useGetOwnedAccount();
  const getSigner = useGetBestSignerForAccount();

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormFields>({
    mode: "onBlur",
  });
  const {
    handleSubmit,
    formState: { isValid, errors },
  } = form;

  const onCSVFileUploadComplete = async (sender: Account, rows: ParseResult<string[]>) => {
    try {
      if (rows.errors.length > 0) {
        throw new Error("Error loading csv file: " + rows.errors.map(e => e.message).join(", "));
      }

      const operations: Operation[] = [];
      for (let i = 0; i < rows.data.length; i++) {
        const row = rows.data[i];
        try {
          operations.push(parseOperation(sender.address, row, getToken));
        } catch (error: any) {
          throw new Error(`Error at row #${i + 1}: ${error?.message}`);
        }
      }

      await dispatch(
        estimateAndUpdateBatch(makeFormOperations(sender, getSigner(sender), operations), network)
      );

      toast({ title: "CSV added to batch!", status: "success" });
      onClose();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, status: "error" });
    }
    setIsLoading(false);
  };

  const onSubmit = async ({ file, sender }: FormFields) => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    const account = getAccount(sender);
    Papa.parse<string[]>(file[0], {
      skipEmptyLines: true,
      complete: (rows: ParseResult<string[]>) => onCSVFileUploadComplete(account, rows),
    });
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalCloseButton />
        <ModalHeader textAlign="center">Load CSV file</ModalHeader>
        <Text textAlign="center">Select an account and then upload the CSV file.</Text>
        <ModalBody>
          <FormControl paddingY={5} isInvalid={!!errors.sender}>
            <OwnedAccountsAutocomplete label="From" inputName="sender" allowUnknown={false} />
            {errors.sender && <FormErrorMessage>{errors.sender.message}</FormErrorMessage>}
          </FormControl>

          <FormControl pt={5} isInvalid={!!errors.file}>
            <FormLabel>Select CSV</FormLabel>
            <Flex>
              <Input
                p={2}
                {...form.register("file", { required: "File is required" })}
                accept=".csv"
                type="file"
                variant="unstyled"
              />
            </Flex>
            {errors.file && <FormErrorMessage mt={0}>{errors.file.message}</FormErrorMessage>}
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Box width="100%">
            <Button isDisabled={!isValid} isLoading={isLoading} width="100%" type="submit" mb={2}>
              Upload
            </Button>
          </Box>
        </ModalFooter>
      </form>
    </FormProvider>
  );
};

export default CSVFileUploadForm;
