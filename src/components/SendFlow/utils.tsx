import { Box, Button } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { RawPkh } from "../../types/Address";
import {
  useGetBestSignerForAccount,
  useGetImplicitAccount,
  useGetOwnedAccount,
} from "../../utils/hooks/accountHooks";
import { useClearBatch } from "../../utils/hooks/batchesHooks";
import { DynamicModalContext } from "../DynamicModal";
import { AccountOperations, makeAccountOperations } from "../sendForm/types";
import BigNumber from "bignumber.js";
import { Operation } from "../../types/Operation";
import { Account } from "../../types/Account";
import { useAsyncActionHandler } from "../../utils/hooks/useAsyncActionHandler";
import { TezosToolkit } from "@taquito/taquito";
import { SuccessStep } from "../sendForm/steps/SuccessStep";
import { estimate, executeOperations } from "../../utils/tezos";
import { useForm } from "react-hook-form";
import { repeat } from "lodash";
import { useSelectedNetwork } from "../../utils/hooks/networkHooks";

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
  operations: AccountOperations;
  fee: BigNumber;
  mode: SignPageMode;
  data: T;
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
          size="lg"
          isLoading={isLoading}
          type="submit"
          isDisabled={!isValid}
          mb="16px"
        >
          Preview
        </Button>
        <Button
          onClick={onAddToBatch}
          width="100%"
          size="lg"
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
  initialFee: BigNumber,
  initialOperations: AccountOperations,
  mode: SignPageMode
) => {
  const [estimationFailed, setEstimationFailed] = useState(false);
  const getSigner = useGetImplicitAccount();
  const [fee, setFee] = useState<BigNumber>(initialFee);
  const [operations, setOperations] = useState<AccountOperations>(initialOperations);
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
      const { opHash } = await executeOperations(operations, tezosToolkit);
      if (mode === "batch") {
        clearBatch(operations.sender);
      }
      openWith(<SuccessStep hash={opHash} />);
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
