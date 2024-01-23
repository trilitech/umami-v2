import { FormControl, Text } from "@chakra-ui/react";
import { FormProvider, useForm } from "react-hook-form";

import { MnemonicAutocomplete } from "./MnemonicAutocomplete";
import { fireEvent, render, screen, waitFor } from "../mocks/testUtils";

type FormFields = { word: string };

const Fixture = ({ validate }: { validate?: (val: string) => string | undefined }) => {
  const form = useForm<FormFields>({ mode: "onBlur" });

  const errors = form.formState.errors;

  return (
    <FormProvider {...form}>
      <FormControl isInvalid={!!errors.word}>
        <MnemonicAutocomplete inputName="word" validate={validate} />
        {errors.word && <Text data-testid="error">{errors.word.message}</Text>}
      </FormControl>
    </FormProvider>
  );
};

describe("<MnemonicAutocomplete />", () => {
  describe("validations", () => {
    it("validates the presence of the input", async () => {
      render(<Fixture />);

      fireEvent.blur(screen.getByTestId("mnemonic-input"));

      await waitFor(() => expect(screen.getByTestId("error")).toHaveTextContent("Required"));
    });

    it("runs the custom validation if it's provided", async () => {
      const validate = (word: string) => {
        if (word.length < 5) {
          return "Too short";
        }
      };
      render(<Fixture validate={validate} />);

      const input = screen.getByTestId("mnemonic-input");

      fireEvent.change(input, { target: { value: "1234" } });
      fireEvent.blur(input);

      await waitFor(() => expect(screen.getByTestId("error")).toHaveTextContent("Too short"));

      fireEvent.change(input, { target: { value: "12345" } });
      fireEvent.blur(input);

      await waitFor(() => expect(screen.queryByTestId("error")).not.toBeInTheDocument());
    });
  });

  describe("suggestions", () => {
    it("doesn't show up when the input is empty", () => {
      render(<Fixture />);

      fireEvent.focus(screen.getByTestId("mnemonic-input"));

      expect(screen.queryByTestId("suggestions")).not.toBeInTheDocument();
    });

    it("shows up when the input is focused and there are suggestions", () => {
      render(<Fixture />);

      const input = screen.getByTestId("mnemonic-input");

      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: "abs" } });

      expect(screen.getByTestId("suggestions")).toBeInTheDocument();
      expect(screen.getAllByTestId("suggestion").map(el => el.textContent)).toEqual([
        "absent",
        "absorb",
        "abstract",
        "absurd",
      ]);
    });

    it("doesn't show up if there is nothing to suggest", () => {
      render(<Fixture />);

      const input = screen.getByTestId("mnemonic-input");

      fireEvent.change(input, { target: { value: "not_existing_word" } });
      fireEvent.focus(input);

      expect(screen.queryByTestId("suggestions")).not.toBeInTheDocument();
    });

    it("hides the suggestions when the input is blurred", () => {
      render(<Fixture />);

      const input = screen.getByTestId("mnemonic-input");

      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: "abs" } });
      fireEvent.blur(input);

      expect(screen.queryByTestId("suggestions")).not.toBeInTheDocument();
    });

    it("hides the suggestions where there is an exact match", () => {
      render(<Fixture />);

      const input = screen.getByTestId("mnemonic-input");

      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: "absent" } });

      expect(screen.queryByTestId("suggestions")).not.toBeInTheDocument();
    });

    it("still shows the only suggestion if it's not an exact match yet", () => {
      render(<Fixture />);

      const input = screen.getByTestId("mnemonic-input");

      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: "absen" } });

      expect(screen.getByTestId("suggestions")).toBeInTheDocument();
      expect(screen.getByTestId("suggestion")).toHaveTextContent("absent");
    });

    it("fills in the input on option click", async () => {
      render(<Fixture />);

      const input = screen.getByTestId("mnemonic-input");

      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: "abs" } });
      fireEvent.mouseDown(screen.getByText("absent"));

      await waitFor(() => expect(input).toHaveProperty("value", "absent"));
    });
  });
});
