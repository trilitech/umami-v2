import { FormProvider, useForm } from "react-hook-form";

import { KnownAccountsAutocomplete } from "./KnownAccountsAutocomplete";
import { mockContractContact, mockImplicitContact } from "../../mocks/factories";
import { fireEvent, render, renderHook, screen, within } from "../../mocks/testUtils";
import { GHOSTNET } from "../../types/Network";
import { contactsActions } from "../../utils/redux/slices/contactsSlice";
import { networksActions } from "../../utils/redux/slices/networks";
import { store } from "../../utils/redux/store";

type FormFields = { destination: string };

describe("<KnownAccountsAutocomplete />", () => {
  it("returns all implicit contacts", () => {
    const contact1 = mockImplicitContact(1);
    const contact2 = mockImplicitContact(2);
    store.dispatch(contactsActions.upsert(contact1));
    store.dispatch(contactsActions.upsert(contact2));

    const view = renderHook(() => useForm<FormFields>({ defaultValues: { destination: "" } }));
    render(
      <FormProvider {...view.result.current}>
        <KnownAccountsAutocomplete allowUnknown inputName="destination" label="" />
      </FormProvider>
    );

    fireEvent.focus(screen.getByLabelText("destination"));
    const suggestions = within(screen.getByTestId("suggestions-list")).queryAllByRole("heading");
    expect(suggestions).toHaveLength(2);
    expect(suggestions[0]).toHaveTextContent(contact1.name);
    expect(suggestions[1]).toHaveTextContent(contact2.name);
  });

  it("returns contract contacts for selected network only", () => {
    store.dispatch(networksActions.setCurrent(GHOSTNET));
    const contact1 = mockContractContact(0, "ghostnet");
    const contact2 = mockContractContact(1, "mainnet");
    const contact3 = mockContractContact(2, "ghostnet");
    store.dispatch(contactsActions.upsert(contact1));
    store.dispatch(contactsActions.upsert(contact2));
    store.dispatch(contactsActions.upsert(contact3));

    const view = renderHook(() => useForm<FormFields>({ defaultValues: { destination: "" } }));
    render(
      <FormProvider {...view.result.current}>
        <KnownAccountsAutocomplete allowUnknown inputName="destination" label="" />
      </FormProvider>
    );

    fireEvent.focus(screen.getByLabelText("destination"));
    const suggestions = within(screen.getByTestId("suggestions-list")).queryAllByRole("heading");
    expect(suggestions).toHaveLength(2);
    expect(suggestions[0]).toHaveTextContent(contact1.name);
    expect(suggestions[1]).toHaveTextContent(contact3.name);
  });
});
