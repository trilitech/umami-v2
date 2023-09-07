import { useContext } from "react";
import { BaseFormValues, FormPageProps, SignPageProps, useMakeFormOperations } from "./utils";
import { DynamicModalContext } from "../DynamicModal";
import { Operation } from "../../types/Operation";
import { useAppDispatch } from "../../utils/redux/hooks";
import { useToast } from "@chakra-ui/toast";
import { estimateAndUpdateBatch } from "../../utils/redux/thunks/estimateAndUpdateBatch";
import { useAsyncActionHandler } from "../../utils/hooks/useAsyncActionHandler";
import { estimate } from "../../utils/tezos";
import { useSelectedNetwork } from "../../utils/hooks/networkHooks";

// This file defines hooks to create actions when form is submitted.

export type OnSubmitFormAction<FormValues extends BaseFormValues> = (
  formValues: FormValues
) => Promise<void>;

type UseOpenSignPageArgs<
  ExtraData,
  FormValues extends BaseFormValues,
  FormProps extends FormPageProps<FormValues>
> = {
  // Sign page component to render.
  SignPage: React.FC<SignPageProps<ExtraData>>;
  // Extra data to pass to the Sign page component (e.g. NFT or Token)
  signPageExtraData: ExtraData;
  // Form page component to render when the user goes back from the sign page.
  FormPage: React.FC<FormProps>;
  // Form page props, used to render the form page again when the user goes back from the sign page
  defaultFormPageProps: FormProps;
  // Function to convert raw form values to the Operation type we can work with
  // to submit operations.
  toOperation: (formValues: FormValues) => Operation;
};

// Hook to open the sign page that knows how to get back to the form page.
export const useOpenSignPageFormAction = <
  SignPageData,
  FormValues extends BaseFormValues,
  FormProps extends FormPageProps<FormValues>
>({
  SignPage,
  signPageExtraData,
  FormPage,
  defaultFormPageProps,
  toOperation,
}: UseOpenSignPageArgs<SignPageData, FormValues, FormProps>): OnSubmitFormAction<FormValues> => {
  const { openWith } = useContext(DynamicModalContext);
  const makeFormOperations = useMakeFormOperations(toOperation);
  const network = useSelectedNetwork();

  return async (formValues: FormValues) => {
    const operations = makeFormOperations(formValues);
    openWith(
      <SignPage
        data={signPageExtraData}
        goBack={() => {
          openWith(
            <FormPage
              {...defaultFormPageProps}
              form={formValues} // whatever user selects on the form should override the default values
            />
          );
        }}
        operations={operations}
        fee={await estimate(operations, network)}
        mode="single"
      />
    );
  };
};

// Hook to add the given form values to the batch.
export const useAddToBatchFormAction = <FormValues extends BaseFormValues>(
  toOperation: (formValues: FormValues) => Operation
): OnSubmitFormAction<FormValues> => {
  const network = useSelectedNetwork();
  const makeFormOperations = useMakeFormOperations(toOperation);
  const dispatch = useAppDispatch();
  const toast = useToast();

  const onAddToBatchAction = async (formValues: FormValues) => {
    const operations = makeFormOperations(formValues);
    await dispatch(estimateAndUpdateBatch(operations, network));
    toast({ title: "Transaction added to batch!", status: "success" });
  };

  return onAddToBatchAction;
};

// Wraps the OnSubmitFormActions in a async action handler that shows a toast if the action fails.
// If any of the actions is loading then isLoading will be true.
export const useHandleOnSubmitFormActions = <FormValues extends BaseFormValues>(
  onSubmitFormActions: OnSubmitFormAction<FormValues>[]
) => {
  const { handleAsyncAction, isLoading } = useAsyncActionHandler();

  const onFormSubmitActionHandlers = onSubmitFormActions.map(
    action => async (formValues: FormValues) => handleAsyncAction(() => action(formValues))
  );

  return {
    onFormSubmitActionHandlers,
    isLoading,
  };
};
