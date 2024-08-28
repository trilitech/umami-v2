import { Button } from "@chakra-ui/react";
import { type Curves } from "@taquito/signer";
import { defaultDerivationPathTemplate } from "@umami/tezos";
import { FormProvider, useForm } from "react-hook-form";

import { AdvancedAccountSettings, CURVES } from "./AdvancedAccountSettings";
import { act, fireEvent, render, screen, userEvent, waitFor } from "../../../testUtils";

const TestComponent = ({ onSubmit }: { onSubmit: () => void }) => {
  const form = useForm<{ derivationPath: string; curve: Curves }>({
    mode: "onBlur",
    defaultValues: {
      derivationPath: defaultDerivationPathTemplate,
      curve: "ed25519",
    },
  });

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <AdvancedAccountSettings />
        <Button type="submit">Submit</Button>
      </form>
    </FormProvider>
  );
};

describe("<AdvancedAccountSettings />", () => {
  it("requires a derivation path", async () => {
    const user = userEvent.setup();
    render(<TestComponent onSubmit={() => {}} />);

    await act(() => user.click(screen.getByText("Advanced")));
    const input = screen.getByLabelText("Derivation Path");
    await act(() => user.clear(input));
    fireEvent.blur(input);

    await waitFor(() => expect(screen.getByText("Derivation path is required")).toBeVisible());
  });

  it.each(CURVES)("has %s curve option", async curve => {
    const user = userEvent.setup();

    render(<TestComponent onSubmit={() => {}} />);

    await act(() => user.click(screen.getByText("Advanced")));

    await waitFor(() => expect(screen.getByRole("button", { name: curve })).toBeVisible());
  });

  it("restores the default derivation on reset click", async () => {
    const user = userEvent.setup();
    render(<TestComponent onSubmit={() => {}} />);

    const input = screen.getByLabelText("Derivation Path");
    await act(() => user.clear(input));
    await act(() => user.click(screen.getByText("Reset")));

    await waitFor(() => expect(input).toHaveValue("44'/1729'/?'/0'"));
  });
});
