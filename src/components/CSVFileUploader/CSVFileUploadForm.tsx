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
import { FormProvider, useForm } from "react-hook-form";
import { Address, parsePkh } from "../../types/Address";
import { RawOperation } from "../../types/RawOperation";
import { useGetPk } from "../../utils/hooks/accountHooks";
import {
  useBatchIsSimulating,
  useClearBatch,
  useSelectedNetwork,
} from "../../utils/hooks/assetsHooks";
import { useGetToken } from "../../utils/hooks/tokensHooks";
import { useAppDispatch } from "../../utils/store/hooks";
import { estimateAndUpdateBatch } from "../../utils/store/thunks/estimateAndupdateBatch";
import { OwnedImplicitAccountsAutocomplete } from "../AddressAutocomplete";
import { parseOperation } from "./utils";

type FormFields = {
  sender: string;
  file: FileList;
};

const CSVFileUploadForm = ({ onClose }: { onClose: () => void }) => {
  const network = useSelectedNetwork();
  const toast = useToast();
  const getPk = useGetPk();
  const getToken = useGetToken();
  const dispatch = useAppDispatch();
  const isSimulating = useBatchIsSimulating();
  const clearBatch = useClearBatch();

  const form = useForm<FormFields>({
    mode: "onBlur",
  });
  const {
    handleSubmit,
    getValues,
    formState: { isValid, errors },
  } = form;

  const onCSVFileUploadComplete = async (sender: Address, rows: ParseResult<string[]>) => {
    if (rows.errors.length > 0) {
      throw new Error("Error loading csv file.");
    }

    const operations: RawOperation[] = [];
    for (let i = 0; i < rows.data.length; i++) {
      const row = rows.data[i];
      try {
        operations.push(parseOperation(sender, row, getToken));
      } catch (error: any) {
        toast({
          title: "error",
          description: `Error at row #${i + 1}: ${error?.message}`,
          status: "error",
        });
        return;
      }
    }

    try {
      await dispatch(estimateAndUpdateBatch(sender.pkh, getPk(sender.pkh), operations, network));

      toast({ title: "CSV added to batch!" });
      onClose();
    } catch (error: any) {
      clearBatch(sender.pkh);
      toast({ title: "Invalid transaction", description: error.message, status: "error" });
    }
  };

  const onSubmit = async ({ file, sender }: FormFields) => {
    const senderAddress = parsePkh(sender);
    Papa.parse<string[]>(file[0], {
      skipEmptyLines: true,
      complete: (rows: ParseResult<string[]>) => onCSVFileUploadComplete(senderAddress, rows),
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
            {/* TODO: Use AllAccountsAutocomplete instead */}
            <OwnedImplicitAccountsAutocomplete
              label="From"
              inputName="sender"
              allowUnknown={false}
            />
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
            <Button
              isDisabled={!isValid}
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
