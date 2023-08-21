import { Box, Button, useToast } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { RawPkh } from "../../types/Address";
import {
  useGetBestSignerForAccount,
  useGetImplicitAccount,
  useGetOwnedAccount,
} from "../../utils/hooks/accountHooks";
import { useClearBatch, useSelectedNetwork } from "../../utils/hooks/assetsHooks";
import { useAppDispatch } from "../../utils/redux/hooks";
import { estimateAndUpdateBatch } from "../../utils/redux/thunks/estimateAndUpdateBatch";
import { DynamicModalContext } from "../DynamicModal";
import { FormOperations, makeFormOperations } from "../sendForm/types";
import BigNumber from "bignumber.js";
import { Operation } from "../../types/Operation";
import { Account } from "../../types/Account";
import { useAsyncActionHandler } from "../../utils/hooks/useAsyncActionHandler";
import { TezosToolkit } from "@taquito/taquito";
import { makeTransfer } from "../sendForm/util/execution";
import { SuccessStep } from "../sendForm/steps/SuccessStep";
import { estimate, TEZ } from "../../utils/tezos";
import { useForm } from "react-hook-form";

export type FormProps<T> = { sender?: Account; form?: T };

export type SignPageMode = "single" | "batch";

export type SignPageProps = {
  goBack?: () => void;
  operations: FormOperations;
  fee: BigNumber;
  mode: SignPageMode;
};

// contains the logic for both submit buttons: submit single operation and add to batch
// should be used on the Send page
// TODO: test this
export const useFormHelpers = <FormValues extends { sender: RawPkh }>(
  // the form might have some default values and in order to instantiate it again
  // with the same values when to go back from the sign page we need to pass them here
  defaultFormProps: FormProps<FormValues>,
  // current form component
  FormComponent: React.FC<FormProps<FormValues>>,
  // the sign page the form should navigate to on single submit
  SignPageComponent: React.FC<SignPageProps>,
  buildOperation: (formValues: FormValues) => Operation
) => {
  const getAccount = useGetOwnedAccount();
  const getSigner = useGetBestSignerForAccount();
  const { openWith } = useContext(DynamicModalContext);
  const dispatch = useAppDispatch();
  const toast = useToast();
  const network = useSelectedNetwork();
  const { isLoading, handleAsyncAction } = useAsyncActionHandler();

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
          goBack={() => {
            openWith(
              <FormComponent
                {...defaultFormProps}
                form={formValues} // whatever user selects on the form should override the default values
              />
            );
          }}
          operations={operations}
          fee={await estimate(operations, network)}
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
    isLoading,
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

// TODO: test this
export const useSignPageHelpers = (
  // the fee & operations you've got from the form
  initialFee: BigNumber,
  initialOperations: FormOperations,
  mode: SignPageMode
) => {
  const [estimationFailed, setEstimationFailed] = useState(false);
  const getSigner = useGetImplicitAccount();
  const [fee, setFee] = useState<BigNumber>(initialFee);
  const [operations, setOperations] = useState<FormOperations>(initialOperations);
  const network = useSelectedNetwork();
  const clearBatch = useClearBatch();
  const { isLoading, handleAsyncAction, handleAsyncActionUnsafe } = useAsyncActionHandler();
  const { openWith } = useContext(DynamicModalContext);
  const form = useForm<{ sender: string; signer: string }>({
    mode: "onBlur",
    defaultValues: { signer: operations.signer.address.pkh, sender: operations.sender.address.pkh },
  });
  const signer = form.watch("signer");

  // if it fails then the sign button must be disabled
  // and the user is supposed to either come back to the form and amend it
  // or choose another signer
  const reEstimate = async (newSigner: RawPkh) =>
    handleAsyncActionUnsafe(
      async () => {
        const operationsWithNewSigner = {
          ...operations,
          signer: getSigner(newSigner),
        };
        setFee(await estimate(operations, network));
        setOperations(operationsWithNewSigner);
        setEstimationFailed(false);
      },
      {
        isClosable: true,
        duration: null, // it makes the toast stick until the user closes it
      }
    ).catch(() => setEstimationFailed(true));

  const onSign = async (tezosToolkit: TezosToolkit) =>
    handleAsyncAction(async () => {
      const { hash } = await makeTransfer(operations, tezosToolkit);
      if (mode === "batch") {
        clearBatch(operations.sender);
      }
      openWith(<SuccessStep hash={hash} />);
    });

  return {
    fee,
    estimationFailed,
    operations,
    isLoading,
    form,
    signer: getSigner(signer),
    reEstimate,
    onSign,
  };
};

export const mutezToPrettyTez = (amount: BigNumber): string => {
  // make sure we always show 6 digits after the decimal point
  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 6,
    maximumFractionDigits: 6,
  });
  return `${formatter.format(amount.dividedBy(10 ** 6).toNumber())} ${TEZ}`;
};
