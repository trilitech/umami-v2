import { FormProvider, useForm } from "react-hook-form";

import { AddressAutocomplete } from "./AddressAutocomplete";
import { mockImplicitAddress, mockImplicitContact } from "../../mocks/factories";
import { fireEvent, render, screen, within } from "../../mocks/testUtils";
import { Contact } from "../../types/Contact";
import { contactsActions } from "../../utils/redux/slices/contactsSlice";
import { store } from "../../utils/redux/store";

type FormFields = { destination: string };

const TestComponent: React.FC<{
  defaultDestination?: string;
  contacts?: Contact[];
  allowUnknown?: boolean;
  label?: string;
  keepValid?: boolean;
}> = ({
  defaultDestination = "",
  allowUnknown = true,
  contacts = [mockImplicitContact(0), mockImplicitContact(1), mockImplicitContact(2)],
  label = "",
  keepValid,
}) => {
  const form = useForm<FormFields>({ defaultValues: { destination: defaultDestination } });

  return (
    <FormProvider {...form}>
      <AddressAutocomplete
        allowUnknown={allowUnknown}
        contacts={contacts}
        inputName="destination"
        keepValid={keepValid}
        label={label}
      />
    </FormProvider>
  );
};

describe("<AddressAutocomplete />", () => {
  it("should set the real input when a valid pkh is entered by the user", () => {
    render(<TestComponent />);

    const rawInput = screen.getByLabelText("destination");
    const realInput = screen.getByTestId("real-address-input-destination");
    fireEvent.change(rawInput, { target: { value: mockImplicitAddress(7).pkh } });

    expect(rawInput).toHaveValue(mockImplicitAddress(7).pkh);
    expect(realInput).toHaveValue(mockImplicitAddress(7).pkh);
  });

  test("the input is never shown when keepValid is set to true, but suggestions are available", () => {
    render(<TestComponent defaultDestination={mockImplicitContact(0).pkh} keepValid />);

    const realInput = screen.getByTestId("real-address-input-destination");
    expect(realInput).toHaveValue(mockImplicitContact(0).pkh);
    expect(screen.queryByLabelText("destination")).not.toBeInTheDocument();
    expect(screen.queryByTestId("suggestions-list")).not.toBeInTheDocument();

    // right icon
    expect(screen.queryByTestId("clear-input-button")).not.toBeInTheDocument();
    expect(screen.getByTestId("chevron-icon")).toBeVisible();

    fireEvent.click(screen.getByTestId(/selected-address-tile-/));
    expect(realInput).toHaveValue(mockImplicitContact(0).pkh);
    expect(screen.queryByLabelText("destination")).not.toBeInTheDocument();
    expect(within(screen.getByTestId("suggestions-list")).queryAllByRole("listitem")).toHaveLength(
      3
    );
  });

  it("hides suggestions by default", () => {
    render(<TestComponent />);
    expect(screen.queryByTestId("suggestions-list")).not.toBeInTheDocument();
  });

  it("shows suggestions when the input is focused", () => {
    render(<TestComponent />);

    const rawInput = screen.getByLabelText("destination");
    fireEvent.focus(rawInput);
    const suggestionsContainer = screen.getByTestId("suggestions-list");

    const suggestions = within(suggestionsContainer).queryAllByRole("listitem");
    expect(suggestions).toHaveLength(3);
  });

  it("hides suggestions if input is an exact suggestion", () => {
    render(<TestComponent />);

    const rawInput = screen.getByLabelText("destination");

    fireEvent.change(rawInput, { target: { value: "Contact 1" } });

    expect(screen.queryByTestId("suggestions-list")).not.toBeInTheDocument();
  });

  it("displays suggestions if user input has suggestions", () => {
    store.dispatch(contactsActions.upsert(mockImplicitContact(0)));
    store.dispatch(contactsActions.upsert(mockImplicitContact(1)));
    render(<TestComponent />);

    const rawInput = screen.getByLabelText("destination");
    expect(rawInput).toBeEnabled();

    fireEvent.focus(rawInput);
    fireEvent.change(rawInput, { target: { value: "tact" } });

    const suggestionsContainer = screen.getByTestId("suggestions-list");
    const suggestions = within(suggestionsContainer).getAllByRole("listitem");
    expect(suggestions).toHaveLength(3);
    expect(within(suggestionsContainer).getByText(mockImplicitContact(0).name)).toBeVisible();
    expect(within(suggestionsContainer).getByText(mockImplicitContact(1).name)).toBeVisible();
    // this one is unknown and its full address will be shows
    expect(within(suggestionsContainer).getByText(mockImplicitContact(2).pkh)).toBeVisible();
  });

  test("choosing a suggestion sets the address and hides suggestions", () => {
    store.dispatch(contactsActions.upsert({ ...mockImplicitContact(1), name: "Abcd" }));
    render(
      <TestComponent
        contacts={[
          { ...mockImplicitContact(1), name: "Abcd" },
          mockImplicitContact(2),
          mockImplicitContact(3),
        ]}
      />
    );

    const rawInput = screen.getByLabelText("destination");
    expect(rawInput).toBeEnabled();
    fireEvent.focus(rawInput);
    fireEvent.change(rawInput, { target: { value: "Abc" } });

    const suggestionsContainer = screen.getByTestId("suggestions-list");
    const matchingSuggestion = within(suggestionsContainer).getByText("Abcd");
    fireEvent.mouseDown(matchingSuggestion);
    expect(rawInput).not.toBeInTheDocument();

    const realInput = screen.getByTestId("real-address-input-destination");
    expect(screen.queryByTestId("suggestions-list")).not.toBeInTheDocument();
    expect(realInput).toHaveValue(mockImplicitContact(1).pkh);
    expect(suggestionsContainer).not.toBeInTheDocument();
  });

  it("works correctly with contacts having the same name", () => {
    const contacts = [
      { ...mockImplicitContact(0), name: "Same Name" },
      { ...mockImplicitContact(1), name: "Same Name" },
    ];
    render(<TestComponent contacts={contacts} />);

    fireEvent.focus(screen.getByLabelText("destination"));
    fireEvent.mouseDown(screen.getByTestId(`suggestion-${contacts[1].pkh}`));

    expect(screen.getByTestId("real-address-input-destination")).toHaveValue(
      mockImplicitContact(1).pkh
    );
  });

  it("displays default address, and does not display any suggestions", () => {
    render(<TestComponent defaultDestination={mockImplicitContact(1).pkh} />);

    const realInput = screen.getByTestId("real-address-input-destination");

    expect(screen.queryByTestId("suggestions-list")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("destination")).not.toBeInTheDocument();
    expect(screen.getByTestId("address-tile")).toHaveTextContent(mockImplicitContact(1).pkh);
    expect(realInput).toHaveValue(mockImplicitContact(1).pkh);
  });

  test("when allowUnknown is false it doesn't set the value to an unknown address even if it's valid", () => {
    render(<TestComponent allowUnknown={false} contacts={[mockImplicitContact(1)]} />);
    const rawInput = screen.getByLabelText("destination");
    const realInput = screen.getByTestId("real-address-input-destination");
    fireEvent.change(rawInput, { target: { value: mockImplicitContact(2).pkh } });

    expect(rawInput).toHaveValue(mockImplicitContact(2).pkh);
    expect(realInput).toHaveValue("");
  });

  describe("right icon", () => {
    it("shows a chevron when the input is empty", () => {
      render(<TestComponent />);
      expect(screen.getByTestId("chevron-icon")).toBeVisible();
      expect(screen.queryByTestId("clear-input-button")).not.toBeInTheDocument();
    });

    it("shows a clear button when the input is not empty", () => {
      render(<TestComponent />);
      const input = screen.getByLabelText("destination");
      fireEvent.change(input, { target: { value: "123" } });
      expect(screen.queryByTestId("chevron-icon")).not.toBeInTheDocument();
      expect(screen.getByTestId("clear-input-button")).toBeVisible();
    });

    it("clears input and shows suggestions when clear input button is clicked", () => {
      render(<TestComponent />);
      const input = screen.getByLabelText("destination");
      fireEvent.focus(input);
      fireEvent.change(input, { target: { value: "Contact" } });
      expect(input).toHaveValue("Contact");

      expect(
        within(screen.getByTestId("suggestions-list")).queryAllByRole("listitem")
      ).toHaveLength(3);

      fireEvent.click(screen.getByTestId("clear-input-button"));

      expect(input).toHaveValue("");
      expect(screen.queryByTestId("clear-input-button")).not.toBeInTheDocument();
      expect(screen.getByTestId("chevron-icon")).toBeVisible();
      expect(
        within(screen.getByTestId("suggestions-list")).queryAllByRole("listitem")
      ).toHaveLength(3);
    });
  });
});
