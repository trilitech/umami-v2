import { Box, Button, useToast } from "@chakra-ui/react";
import { useContext } from "react";
import { RawPkh } from "../../types/Address";
import { useGetBestSignerForAccount, useGetOwnedAccount } from "../../utils/hooks/accountHooks";
import { useSelectedNetwork } from "../../utils/hooks/assetsHooks";
import { useAppDispatch } from "../../utils/redux/hooks";
import { estimateAndUpdateBatch } from "../../utils/redux/thunks/estimateAndUpdateBatch";
import { estimateTotalFee } from "../../views/batch/batchUtils";
import { DynamicModalContext } from "../DynamicModal";
import { FormOperations, makeFormOperations } from "../sendForm/types";
import BigNumber from "bignumber.js";
import { Operation } from "../../types/Operation";
import { Account } from "../../types/Account";
import { useAsyncActionHandler } from "../../utils/hooks/useAsyncActionHandler";

export type FormProps<T> = { sender?: Account; form?: T };

export type SignPageMode = "single" | "batch";

export type SignPageProps = {
  goBack?: () => void;
  operations: FormOperations;
  fee: BigNumber;
  mode: SignPageMode;
};

export const useFormHelpers = <FormProps, FormValues extends { sender: RawPkh }>(
  defaultFormProps: FormProps,
  FormComponent: React.FC<FormProps>,
  SignPageComponent: React.FC<SignPageProps>,
  handleAsyncAction: ReturnType<typeof useAsyncActionHandler>["handleAsyncAction"],
  buildOperation: (formValues: FormValues) => Operation
) => {
  const getAccount = useGetOwnedAccount();
  const getSigner = useGetBestSignerForAccount();
  const { openWith } = useContext(DynamicModalContext);
  const dispatch = useAppDispatch();
  const toast = useToast();
  const network = useSelectedNetwork();

  const buildFormOperations = (formValues: FormValues) => {
    const sender = getAccount(formValues.sender);
    const signer = getSigner(sender);
    return makeFormOperations(sender, signer, [buildOperation(formValues)]);
  };

  const onSingleSubmit = async (formValues: FormValues) => {
    return handleAsyncAction(async () => {
      const operations = buildFormOperations(formValues);
      openWith(
        <SignPageComponent
          goBack={() => openWith(<FormComponent {...defaultFormProps} form={formValues} />)}
          operations={operations}
          fee={await estimateTotalFee(operations, network)}
          mode="single"
        />
      );
    });
  };

  const onAddToBatch = async (formValues: FormValues) => {
    handleAsyncAction(async () => {
      const operations = buildFormOperations(formValues);
      await dispatch(estimateAndUpdateBatch(operations, network));
      toast({ title: "Transaction added to batch!", status: "success" });
    });
  };

  return {
    onAddToBatch,
    onSingleSubmit,
    buildOperations: buildFormOperations,
  };
};

export const FormSubmitButtons = ({
  isLoading,
  isValid,
  onSingleSubmit,
  onAddToBatch,
}: {
  isLoading: boolean;
  isValid: boolean;
  onSingleSubmit: () => Promise<void>;
  onAddToBatch: () => Promise<void>;
}) => {
  return (
    <>
      <Box width="100%">
        <Button
          onClick={onSingleSubmit}
          width="100%"
          isLoading={isLoading}
          type="submit"
          isDisabled={!isValid}
          variant="primary"
          mb="16px"
        >
          Preview
        </Button>
        <Button
          onClick={onAddToBatch}
          width="100%"
          isLoading={isLoading}
          type="submit"
          isDisabled={!isValid}
          variant="tertiary"
        >
          Insert Into Batch
        </Button>
      </Box>
    </>
  );
};

export const formDefaultValues = <T,>({ sender, form }: FormProps<T>) => {
  if (form) {
    return form;
  } else if (sender) {
    return { sender: sender.address.pkh };
  } else {
    return {};
  }
};
