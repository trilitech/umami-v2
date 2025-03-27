import { useDynamicModalContext } from "@umami/components";
import {
  type EstimatedAccountOperations,
  type FA12TokenBalance,
  type FA2TokenBalance,
  type Operation,
  estimate,
} from "@umami/core";
import {
  estimateAndUpdateBatch,
  useAppDispatch,
  useAsyncActionHandler,
  useSelectedNetwork,
} from "@umami/state";
import { useCustomToast } from "@umami/utils";
import { type FunctionComponent } from "react";

import { LocalSignPage } from "./LocalSignPage";
import { type BaseFormValues, type FormPageProps, useMakeFormOperations } from "./utils";

// This file defines hooks to create actions when form is submitted.

type OnSubmitFormAction<FormValues extends BaseFormValues> = (
  formValues: FormValues
) => Promise<void>;

type UseOpenSignPageArgs<
  FormValues extends BaseFormValues,
  FormProps extends FormPageProps<FormValues>,
> = {
  operationType: "token" | "tez";
  token?: FA12TokenBalance | FA2TokenBalance;
  // Form page component to render when the user goes back from the sign page.
  FormPage: FunctionComponent<FormProps>;
  // Form page props, used to render the form page again when the user goes back from the sign page
  defaultFormPageProps: FormProps;
  // Function to convert raw form values to the Operation type we can work with
  // to submit operations.
  toOperation: (formValues: FormValues) => Operation;
};

// Hook to open the sign page that knows how to get back to the form page.
export const useOpenSignPageFormAction = <
  FormValues extends BaseFormValues,
  FormProps extends FormPageProps<FormValues>,
>({
  operationType,
  token,
  FormPage,
  defaultFormPageProps,
  toOperation,
}: UseOpenSignPageArgs<FormValues, FormProps>): OnSubmitFormAction<FormValues> => {
  const { openWith } = useDynamicModalContext();
  const makeFormOperations = useMakeFormOperations(toOperation);
  const network = useSelectedNetwork();

  return async (formValues: FormValues) => {
    const operations = makeFormOperations(formValues);
    const estimatedOperations = await estimate(operations, network);

    return openWith(
      <LocalSignPage
        goBack={() =>
          openWith(
            <FormPage
              {...defaultFormPageProps}
              form={formValues} // whatever user selects on the form should override the default values
            />
          )
        }
        operationType={operationType}
        operations={estimatedOperations}
        token={token}
      />
    );
  };
};

export const useAddToBatchFormAction = <FormValues extends BaseFormValues>(
  toOperation: (formValues: FormValues) => Operation
): OnSubmitFormAction<FormValues> => {
  const { onClose } = useDynamicModalContext();
  const network = useSelectedNetwork();
  const makeFormOperations = useMakeFormOperations(toOperation);
  const dispatch = useAppDispatch();
  const toast = useCustomToast();

  const onAddToBatchAction = async (formValues: FormValues) => {
    const operations = makeFormOperations(formValues);
    await dispatch(estimateAndUpdateBatch(operations, network));
    toast({ description: "Transaction added to batch!", status: "success" });
    onClose();
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

export function usePreviewOperations<
  FormValues extends BaseFormValues,
  SignPageProps extends { operations: EstimatedAccountOperations } = {
    operations: EstimatedAccountOperations;
  },
>(
  toOperation: (formValues: FormValues) => Operation | Operation[],
  SignPage: FunctionComponent<SignPageProps>,
  props: Omit<SignPageProps, "operations">
) {
  const network = useSelectedNetwork();
  const makeFormOperations = useMakeFormOperations(toOperation);
  const { handleAsyncAction, isLoading } = useAsyncActionHandler();
  const { openWith } = useDynamicModalContext();

  return {
    isLoading,
    previewOperation: (formValues: FormValues) =>
      handleAsyncAction(async () => {
        const operations = makeFormOperations(formValues);
        const estimatedOperations = await estimate(operations, network);

        return openWith(
          <SignPage {...(props as SignPageProps)} operations={estimatedOperations} />
        );
      }),
  };
}
export const usePreviewOperation = usePreviewOperations;
