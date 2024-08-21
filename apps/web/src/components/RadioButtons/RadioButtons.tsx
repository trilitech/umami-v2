import { Button, type ButtonProps } from "@chakra-ui/react";
import { type FieldValues, type Path, type PathValue, useFormContext } from "react-hook-form";

import { useColor } from "../../styles/useColor";

export const RadioButtons = <T extends FieldValues, U extends Path<T>, V extends PathValue<T, U>>({
  options,
  inputName,
  onSelect,
  ...props
}: {
  options: V[];
  inputName: U;
  onSelect?: (value: V) => void;
} & Omit<ButtonProps, "onSelect">) => {
  const form = useFormContext<T>();
  const color = useColor();

  return (
    <>
      {options.map(option => {
        const isSelected = form.getValues(inputName) === option;

        return (
          <Button
            key={option}
            width="full"
            borderColor={color("100")}
            borderRadius="4px"
            onClick={() => {
              onSelect?.(option);
              form.setValue(inputName, option);
            }}
            variant={isSelected ? "solid" : "outline"}
            {...props}
          >
            {option}
          </Button>
        );
      })}
    </>
  );
};
