import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@chakra-ui/react";

import { useDynamicModalContext } from "./DynamicDisclosure";
import { useMultiForm } from "./useMultiForm";
import { act, renderHook, screen, userEvent, waitFor } from "../testUtils";

const Page3 = () => {
  const { goBack, allFormValues } = useDynamicModalContext();

  return (
    <ModalContent>
      <ModalHeader>
        <Button onClick={() => goBack()}>Go back</Button>
      </ModalHeader>
      <ModalBody>
        <Box data-testid="all-form-values">{JSON.stringify(allFormValues.current)}</Box>
      </ModalBody>
    </ModalContent>
  );
};

const Page2 = () => {
  const { goBack, openWith } = useDynamicModalContext();
  const form = useMultiForm<{ param2: string; param3: string }>({ mode: "onBlur" });

  return (
    <ModalContent>
      <ModalHeader>
        <Button onClick={() => goBack()}>Go back</Button>
      </ModalHeader>
      <ModalBody>
        <form data-testid="form2" onSubmit={form.handleSubmit(() => openWith(<Page3 />))}>
          <FormControl>
            <FormLabel>param 2</FormLabel>
            <Input {...form.register("param2")} />
          </FormControl>
          <FormControl>
            <FormLabel>param 3</FormLabel>
            <Input {...form.register("param3")} />
          </FormControl>
          <Button type="submit">Continue</Button>
        </form>
      </ModalBody>
    </ModalContent>
  );
};

const Page1 = () => {
  const { openWith } = useDynamicModalContext();
  const form = useMultiForm<{ param1: string; param2: string }>({ mode: "onBlur" });
  return (
    <ModalContent>
      <ModalBody>
        <form data-testid="form1" onSubmit={form.handleSubmit(() => openWith(<Page2 />))}>
          <FormControl>
            <FormLabel>param 1</FormLabel>
            <Input {...form.register("param1")} />
          </FormControl>
          <FormControl>
            <FormLabel>param 2</FormLabel>
            <Input {...form.register("param2")} />
          </FormControl>
          <Button type="submit">Continue</Button>
        </form>
      </ModalBody>
    </ModalContent>
  );
};

describe("useMultiForm", () => {
  test("allFormValues", async () => {
    const user = userEvent.setup();
    const {
      result: {
        current: { openWith },
      },
    } = renderHook(() => useDynamicModalContext());

    await act(() => openWith(<Page1 />));
    await waitFor(() => expect(screen.getByTestId("form1")).toBeVisible());

    await act(() => user.type(screen.getByLabelText("param 1"), "value 1"));
    await act(() => user.type(screen.getByLabelText("param 2"), "value 2"));
    await act(() => user.click(screen.getByRole("button", { name: "Continue" })));
    await waitFor(() => expect(screen.getByTestId("form2")).toBeVisible());

    await act(() => user.type(screen.getByLabelText("param 2"), "value 2 overwritten"));
    await act(() => user.type(screen.getByLabelText("param 3"), "value 3"));
    await act(() => user.click(screen.getByRole("button", { name: "Continue" })));

    const json = JSON.parse(screen.getByTestId("all-form-values").textContent!);

    expect(json).toEqual({
      param1: "value 1",
      param2: "value 2 overwritten",
      param3: "value 3",
    });
  });

  it("goes back and re-fills the forms", async () => {
    const user = userEvent.setup();
    const {
      result: {
        current: { openWith },
      },
    } = renderHook(() => useDynamicModalContext());

    await act(() => openWith(<Page1 />));
    await waitFor(() => expect(screen.getByTestId("form1")).toBeVisible());

    await act(() => user.type(screen.getByLabelText("param 1"), "value 1"));
    await act(() => user.type(screen.getByLabelText("param 2"), "value 2"));
    await act(() => user.click(screen.getByRole("button", { name: "Continue" })));
    await waitFor(() => expect(screen.getByTestId("form2")).toBeVisible());

    await act(() => user.type(screen.getByLabelText("param 2"), "value 2 overwritten"));
    await act(() => user.type(screen.getByLabelText("param 3"), "value 3"));
    await act(() => user.click(screen.getByRole("button", { name: "Continue" })));

    await waitFor(() => expect(screen.getByTestId("all-form-values")).toBeVisible());
    await act(() => user.click(screen.getByRole("button", { name: "Go back" })));
    await waitFor(() => expect(screen.getByTestId("form2")).toBeVisible());

    expect(screen.getByLabelText("param 2")).toHaveValue("value 2 overwritten");
    expect(screen.getByLabelText("param 3")).toHaveValue("value 3");

    await act(() => user.click(screen.getByRole("button", { name: "Go back" })));
    await waitFor(() => expect(screen.getByTestId("form1")).toBeVisible());

    expect(screen.getByLabelText("param 1")).toHaveValue("value 1");
    expect(screen.getByLabelText("param 2")).toHaveValue("value 2");
  });

  it("can go back and change the form values", async () => {
    const user = userEvent.setup();
    const {
      result: {
        current: { openWith },
      },
    } = renderHook(() => useDynamicModalContext());

    await act(() => openWith(<Page1 />));
    await waitFor(() => expect(screen.getByTestId("form1")).toBeVisible());

    await act(() => user.type(screen.getByLabelText("param 1"), "value 1"));
    await act(() => user.type(screen.getByLabelText("param 2"), "value 2"));
    await act(() => user.click(screen.getByRole("button", { name: "Continue" })));
    await waitFor(() => expect(screen.getByTestId("form2")).toBeVisible());

    await act(() => user.type(screen.getByLabelText("param 2"), "value 2 overwritten"));
    await act(() => user.type(screen.getByLabelText("param 3"), "value 3"));
    await act(() => user.click(screen.getByRole("button", { name: "Continue" })));

    await waitFor(() => expect(screen.getByTestId("all-form-values")).toBeVisible());
    await act(() => user.click(screen.getByRole("button", { name: "Go back" })));
    await waitFor(() => expect(screen.getByTestId("form2")).toBeVisible());

    await act(() => user.clear(screen.getByLabelText("param 3")));
    await act(() => user.type(screen.getByLabelText("param 3"), "value 3 new"));
    await act(() => user.click(screen.getByRole("button", { name: "Continue" })));

    await waitFor(() => expect(screen.getByTestId("all-form-values")).toBeVisible());
    const json = JSON.parse(screen.getByTestId("all-form-values").textContent!);
    expect(json).toEqual({
      param1: "value 1",
      param2: "value 2 overwritten",
      param3: "value 3 new",
    });
  });
});
