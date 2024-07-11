import { type PropsWithChildren, createContext, useContext, useRef } from "react";

interface FormContextType {
  formState: any;
  setFormState: React.Dispatch<React.SetStateAction<any>>;
  reset: () => void;
}

const FormContext = createContext<FormContextType>({
  formState: null,
  setFormState: () => {},
  reset: () => {},
});

export const useDynamicModalFormContext = () => useContext(FormContext) as FormContextType;

export const DynamicModalFormContextProvider = ({ children }: PropsWithChildren) => {
  const formState = useRef<FormContextType["formState"]>(null);

  const setFormState = (state: FormContextType["formState"]) => {
    formState.current = { ...(formState.current ?? {}), ...state };
  };

  const reset = () => {
    formState.current = null;
  };

  return (
    <FormContext.Provider value={{ formState, setFormState, reset }}>
      {children}
    </FormContext.Provider>
  );
};
