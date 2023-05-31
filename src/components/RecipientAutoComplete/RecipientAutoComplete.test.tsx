import { mockContact, mockPkh } from "../../mocks/factories";
import { act, fireEvent, render, screen, within } from "../../mocks/testUtils";
import { RecipientAutoCompleteDisplay } from "./RecipientAutoComplete";

const spy = jest.fn();

const setup = (initialPkhValue?: string) => {
  render(
    <RecipientAutoCompleteDisplay
      contacts={[mockContact(0), mockContact(1), mockContact(2)]}
      onValidPkh={spy}
      initialPkhValue={initialPkhValue}
    />
  );
};

const assertHiddenSuggetions = () => {
  const suggestionContainer = screen.queryByRole("list");
  expect(suggestionContainer).not.toBeInTheDocument();
};

describe("<RecipientAutoComplete />", () => {
  it("should fire onValidPkh when a valid pkh is entered by the user", () => {
    setup();
    const input = screen.getByLabelText("recipient");
    fireEvent.change(input, { target: { value: mockPkh(7) } });
    expect(input).toHaveProperty("value", mockPkh(7));
    expect(spy).toHaveBeenCalledWith(mockPkh(7));
  });

  it("should fire null when a value that is not a pkh or an alias is entered by the user", () => {
    setup();
    const input = screen.getByLabelText("recipient");
    const INVALID = "not a pkh or an alias";
    fireEvent.change(input, { target: { value: INVALID } });

    expect(input).toHaveProperty("value", INVALID);
    expect(spy).toHaveBeenCalledWith(null);
  });

  it("should hide suggestions when input is empty and unfocused", async () => {
    setup();

    assertHiddenSuggetions();
  });

  it("should show suggestions when input is empty and focused", async () => {
    setup();

    const input = screen.getByLabelText("recipient");
    fireEvent.focus(input);
    const suggestionContainer = screen.getByRole("list");

    const suggestions = within(suggestionContainer).queryAllByRole("listitem");
    expect(suggestions).toHaveLength(3);
  });

  it("should hide suggestions if input is an exact suggestion", async () => {
    setup();

    const input = screen.getByLabelText("recipient");

    fireEvent.change(input, { target: { value: "Contact 1" } });

    assertHiddenSuggetions();
  });

  it("should display suggestions if user input has suggestions", async () => {
    setup();
    const input = screen.getByLabelText("recipient");

    expect(input).toBeEnabled();

    fireEvent.change(input, { target: { value: "tact" } });

    act(() => {
      input.focus();
    });

    const suggestionContainer = screen.getByRole("list");
    const suggestions = within(suggestionContainer).getAllByRole("listitem");
    expect(suggestions).toHaveLength(3);
    expect(
      within(suggestionContainer).getByText(mockContact(0).name)
    ).toBeInTheDocument();
    expect(
      within(suggestionContainer).getByText(mockContact(1).name)
    ).toBeInTheDocument();
    expect(
      within(suggestionContainer).getByText(mockContact(2).name)
    ).toBeInTheDocument();
  });

  test("choosing a suggestions submits the pkh, inputs the contact name and hides suggestions", () => {
    setup();
    const input = screen.getByLabelText("recipient");

    expect(input).toBeEnabled();

    fireEvent.change(input, { target: { value: "Contact" } });

    act(() => {
      input.focus();
    });

    const suggestionContainer = screen.getByRole("list");

    const sug = within(suggestionContainer).getByText(mockContact(1).name);

    fireEvent.mouseDown(sug);
    expect(input).toHaveProperty("value", mockContact(1).name);

    assertHiddenSuggetions();
    expect(spy).toHaveBeenCalledWith(mockContact(1).pkh);
  });

  it("should display initialPkhValue's contact if any, and not display any suggestions", async () => {
    const initialPkhValue = mockContact(1).pkh;

    render(
      <RecipientAutoCompleteDisplay
        contacts={[
          {
            name: "foo",
            pkh: mockContact(0).pkh,
          },
          {
            name: "foo1",
            pkh: mockContact(1).pkh,
          },
          {
            name: "foo2",
            pkh: mockContact(2).pkh,
          },
        ]}
        onValidPkh={spy}
        initialPkhValue={initialPkhValue}
      />
    );

    assertHiddenSuggetions();
    const input = screen.getByLabelText("recipient");
    expect(input).toHaveProperty("value", "foo1");
  });

  it("should display initialPkhValue if there is no existing contact", async () => {
    setup(mockPkh(5));

    const input = screen.getByLabelText("recipient");
    expect(input).toHaveProperty("value", mockPkh(5));
  });

  test("Entering a pkh that belongs to a contact should display contact name in the input", () => {
    setup();
    const input = screen.getByLabelText("recipient");

    fireEvent.change(input, { target: { value: mockContact(1).pkh } });

    expect(input).toHaveProperty("value", mockContact(1).name);
  });
});
