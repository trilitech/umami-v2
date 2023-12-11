import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  useToast,
} from "@chakra-ui/react";
import Papa, { ParseResult } from "papaparse";
import { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { parseOperation } from "./utils";
import { makeAccountOperations } from "../../types/AccountOperations";
import { RawPkh } from "../../types/Address";
import { Operation } from "../../types/Operation";
import {
  useGetBestSignerForAccount,
  useGetOwnedAccount,
} from "../../utils/hooks/getAccountDataHooks";
import { useSelectedNetwork } from "../../utils/hooks/networkHooks";
import { useGetToken } from "../../utils/hooks/tokensHooks";
import { useAsyncActionHandler } from "../../utils/hooks/useAsyncActionHandler";
import { useAppDispatch } from "../../utils/redux/hooks";
import { estimateAndUpdateBatch } from "../../utils/redux/thunks/estimateAndUpdateBatch";
import { OwnedAccountsAutocomplete } from "../AddressAutocomplete";
import { DynamicModalContext } from "../DynamicModal";
import { FormErrorMessage } from "../FormErrorMessage";

type FormFields = {
  sender: RawPkh;
  file: FileList;
};

export const CSVFileUploadForm = () => {
  const network = useSelectedNetwork();
  const toast = useToast();
  const getToken = useGetToken();
  const dispatch = useAppDispatch();
  const getAccount = useGetOwnedAccount();
  const getSigner = useGetBestSignerForAccount();
  const { onClose } = useContext(DynamicModalContext);
  const { isLoading, handleAsyncAction } = useAsyncActionHandler();

  const form = useForm<FormFields>({
    mode: "onBlur",
  });
  const {
    handleSubmit,
    formState: { isValid, errors },
  } = form;

  const onSubmit = async ({ file, sender }: FormFields) =>
    handleAsyncAction(async () => {
      const senderAccount = getAccount(sender);
      const rows = await new Promise<ParseResult<string[]>>(resolve => {
        Papa.parse(file[0], { skipEmptyLines: true, complete: resolve });
      });
      if (rows.errors.length > 0) {
        throw new Error("Error loading csv file: " + rows.errors.map(e => e.message).join(", "));
      }

      const operations: Operation[] = [];
      for (let i = 0; i < rows.data.length; i++) {
        const row = rows.data[i];
        try {
          operations.push(parseOperation(senderAccount.address, row, getToken));
        } catch (error: any) {
          throw new Error(`Error at row #${i + 1}: ${error?.message}`);
        }
      }

      await dispatch(
        estimateAndUpdateBatch(
          makeAccountOperations(senderAccount, getSigner(senderAccount), operations),
          network
        )
      );

      toast({ description: "CSV added to batch!", status: "success" });
      onClose();
    });

  return (
    <FormProvider {...form}>
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalCloseButton />
          <ModalHeader textAlign="center">Load CSV file</ModalHeader>
          <Text textAlign="center">Select an account and then upload the CSV file.</Text>
          <ModalBody>
            <FormControl isInvalid={!!errors.sender} paddingY={5}>
              <OwnedAccountsAutocomplete allowUnknown={false} inputName="sender" label="From" />
              {errors.sender && <FormErrorMessage>{errors.sender.message}</FormErrorMessage>}
            </FormControl>

            <FormControl paddingTop={5} isInvalid={!!errors.file}>
              <FormLabel>Select CSV</FormLabel>
              <Flex>
                <Input
                  padding={2}
                  {...form.register("file", { required: "File is required" })}
                  accept=".csv"
                  type="file"
                  variant="unstyled"
                />
              </Flex>
              {errors.file && (
                <FormErrorMessage marginTop={0}>{errors.file.message}</FormErrorMessage>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Box width="100%">
              <Button
                width="100%"
                marginBottom={2}
                isDisabled={!isValid}
                isLoading={isLoading}
                size="lg"
                type="submit"
              >
                Upload
              </Button>
            </Box>
          </ModalFooter>
        </form>
      </ModalContent>
    </FormProvider>
  );
};
