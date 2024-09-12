import merge from "lodash/merge";
import { type FieldValues, type UseFormProps, type UseFormReturn, useForm } from "react-hook-form";

import { useDynamicDrawerContext, useDynamicModalContext } from "./DynamicDisclosure";

export const useMultiForm = <
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTransformedValues extends FieldValues | undefined = undefined,
>({
  usedIn,
  ...props
}: UseFormProps<TFieldValues, TContext> & { usedIn?: "drawer" | "modal" }): UseFormReturn<
  TFieldValues,
  TContext,
  TTransformedValues
> => {
  const modalContext = useDynamicModalContext();
  const drawerContext = useDynamicDrawerContext();

  const formDefaultValues =
    usedIn === "drawer" ? drawerContext.formValues : modalContext.formValues;

  const form = useForm<TFieldValues, TContext, TTransformedValues>({
    ...props,
    defaultValues: { ...props.defaultValues, ...formDefaultValues } as any,
  });

  const handleSubmit = (
    onValid: Parameters<typeof form.handleSubmit>[0],
    onInvalid: Parameters<typeof form.handleSubmit>[1]
  ) =>
    form.handleSubmit(
      ((submittedValues: any) => {
        // update current context values
        merge(formDefaultValues, submittedValues);
        return onValid(submittedValues);
      }) as any,
      onInvalid
    );

  return {
    ...form,
    handleSubmit,
  };
};
