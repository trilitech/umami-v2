import { Button, type ButtonProps } from "@chakra-ui/react";
import { type TezosToolkit } from "@taquito/taquito";
import { useDynamicModalContext } from "@umami/components";
import {
  type Account,
  type AccountOperations,
  type EstimatedAccountOperations,
  type Operation,
  estimate,
  executeOperations,
  makeAccountOperations,
  totalFee,
} from "@umami/core";
import {
  useAsyncActionHandler,
  useClearBatch,
  useGetBestSignerForAccount,
  useGetImplicitAccount,
  useGetOwnedAccount,
  useSelectedNetwork,
} from "@umami/state";
import { type ExecuteParams, type RawPkh } from "@umami/tezos";
import { repeat } from "lodash";
import { useState } from "react";
import { useForm, useFormContext } from "react-hook-form";

import { SuccessStep } from "./SuccessStep";

// Convert given optional fields to required
// For example:
// type A = {a?:number, b:string}
// RequiredFields<A, "a"> === {a:number, b:string}
type RequiredFields<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export type FormPageProps<T> = { sender?: Account; form?: T };

// FormPagePropsWithSender is the same as FormPageProps but with sender required,
// Use this when we don't want to give the users options to select the sender
// (e.g. the nft and token form)
export type FormPagePropsWithSender<T> = RequiredFields<FormPageProps<T>, "sender">;

// Form values should always have a sender field.
export type BaseFormValues = { sender: RawPkh };

export type SignPageMode = "single" | "batch";

export type SignPageProps<T = undefined> = {
  goBack?: () => void;
  operations: EstimatedAccountOperations;
  mode: SignPageMode;
  data: T;
};

export const FormSubmitButton = ({ title = "Preview", ...props }: ButtonProps) => {
  const {
    formState: { isValid },
  } = useFormContext();

  return (
    <Button width="full" isDisabled={!isValid} size="lg" type="submit" variant="primary" {...props}>
      {title}
    </Button>
  );
};

export const formDefaultValues = <T,>({ sender, form }: FormPageProps<T>) => {
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
  initialOperations: EstimatedAccountOperations,
  mode: SignPageMode
) => {
  const [estimationFailed, setEstimationFailed] = useState(false);
  const getSigner = useGetImplicitAccount();
  const [operations, setOperations] = useState<EstimatedAccountOperations>(initialOperations);
  const network = useSelectedNetwork();
  const clearBatch = useClearBatch();
  const { isLoading, handleAsyncAction, handleAsyncActionUnsafe } = useAsyncActionHandler();
  const { openWith } = useDynamicModalContext();

  const form = useForm<{
    sender: string;
    signer: string;
    executeParams: ExecuteParams[];
  }>({
    mode: "onBlur",
    defaultValues: {
      signer: operations.signer.address.pkh,
      sender: operations.sender.address.pkh,
      executeParams: operations.estimates,
    },
  });

  const signer = form.watch("signer");

  // if it fails then the sign button must be disabled
  // and the user is supposed to either come back to the form and amend it
  // or choose another signer
  const reEstimate = async (newSigner: RawPkh) =>
    handleAsyncActionUnsafe(
      async () => {
        const newOperations = await estimate(
          {
            ...operations,
            signer: getSigner(newSigner),
          },
          network
        );
        form.setValue("executeParams", newOperations.estimates);
        setOperations(newOperations);
        setEstimationFailed(false);
      },
      {
        isClosable: true,
        duration: null, // it makes the toast stick until the user closes it
      }
    ).catch(() => setEstimationFailed(true));

  const onSign = async (tezosToolkit: TezosToolkit) =>
    handleAsyncAction(async () => {
      const operation = await executeOperations(
        { ...operations, estimates: form.watch("executeParams") },
        tezosToolkit
      );
      if (mode === "batch") {
        clearBatch(operations.sender);
      }
      await openWith(<SuccessStep hash={operation.opHash} />);
      return operation;
    });

  return {
    fee: totalFee(form.watch("executeParams")),
    estimationFailed,
    operations,
    isLoading,
    form,
    signer: getSigner(signer),
    reEstimate,
    onSign,
  };
};

export const useMakeFormOperations = <FormValues extends BaseFormValues>(
  toOperation: (formValues: FormValues) => Operation
): ((formValues: FormValues) => AccountOperations) => {
  const getAccount = useGetOwnedAccount();
  const getSigner = useGetBestSignerForAccount();

  return (formValues: FormValues) => {
    const sender = getAccount(formValues.sender);
    return makeAccountOperations(sender, getSigner(sender), [toOperation(formValues)]);
  };
};

export const getSmallestUnit = (decimals: number): string => {
  if (decimals < 0) {
    console.warn("Decimals cannot be negative");
    decimals = 0;
  }

  const leadingZeroes = decimals === 0 ? "" : "0." + repeat("0", decimals - 1);
  return `${leadingZeroes}1`;
};

export const makeValidateDecimals = (decimals: number) => (val: string) => {
  if (val.includes(".")) {
    const decimalPart = val.split(".")[1];
    if (decimalPart.length > decimals) {
      return `Please enter a value with up to ${decimals} decimal places`;
    }
  }
  return true;
};
