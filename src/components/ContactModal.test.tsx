import { UpsertContactModal } from "./ContactModal";
import { contact1, contact2 } from "../mocks/contacts";
import { mockImplicitAddress } from "../mocks/factories";
import { fireEvent, render, screen, waitFor } from "../mocks/testUtils";
import { contactsActions } from "../utils/redux/slices/contactsSlice";
import { store } from "../utils/redux/store";

describe("UpsertContactModal", () => {
  describe("on adding contact", () => {
    describe.each([
      { testCase: "new contact", renderComponent: () => render(<UpsertContactModal />) },
      {
        testCase: "pre-set contact",
        renderComponent: () =>
          render(
            <UpsertContactModal
              contact={{
                name: "",
                pkh: mockImplicitAddress(0).pkh,
              }}
            />
          ),
      },
    ])("for $testCase", ({ renderComponent }) => {
      it("shows correct title & button label for new contact", () => {
        renderComponent();

        expect(screen.getByRole("dialog")).toHaveTextContent("Add Contact");
        expect(screen.getByTestId("confirmation-button")).toHaveTextContent("Add to Address Book");
      });

      it("has editable address & name fields", () => {
        renderComponent();

        expect(screen.getByLabelText("Address")).toBeEnabled();
        expect(screen.getByLabelText("Name")).toBeEnabled();
      });

      it("validates updated address", async () => {
        renderComponent();

        const addressInput = screen.getByLabelText("Address");
        fireEvent.change(addressInput, {
          target: { value: "invalid pkh" },
        });
        fireEvent.blur(addressInput);

        await waitFor(() =>
          expect(screen.getByTestId("address-error")).toHaveTextContent("Invalid address")
        );
      });

      it("checks the name is unique", async () => {
        store.dispatch(contactsActions.upsert(contact2));
        renderComponent();

        fireEvent.change(screen.getByLabelText("Name"), {
          target: { value: contact2.name },
        });
        fireEvent.blur(screen.getByLabelText("Name"));

        await waitFor(() =>
          expect(screen.getByTestId("name-error")).toHaveTextContent(
            "Name must be unique across all accounts and contacts"
          )
        );
      });

      it("adds contact to address book", async () => {
        store.dispatch(contactsActions.upsert(contact2));
        renderComponent();

        // Set name
        fireEvent.change(screen.getByLabelText("Name"), {
          target: { value: "Test Contact" },
        });
        fireEvent.blur(screen.getByLabelText("Name"));
        // Set address
        fireEvent.change(screen.getByLabelText("Address"), {
          target: { value: mockImplicitAddress(5).pkh },
        });
        fireEvent.blur(screen.getByLabelText("Address"));
        // Submit
        await waitFor(() => expect(screen.getByTestId("confirmation-button")).toBeEnabled());
        fireEvent.click(screen.getByTestId("confirmation-button"));

        await waitFor(() =>
          expect(store.getState().contacts).toEqual({
            [contact2.pkh]: contact2,
            [mockImplicitAddress(5).pkh]: {
              name: "Test Contact",
              pkh: mockImplicitAddress(5).pkh,
            },
          })
        );
      });
    });

    describe("for pre-set contact", () => {
      it("has pre-filled address field", () => {
        render(
          <UpsertContactModal
            contact={{
              name: "",
              pkh: mockImplicitAddress(0).pkh,
            }}
          />
        );

        expect(screen.getByLabelText("Address")).toHaveValue(mockImplicitAddress(0).pkh);
      });

      it("validates initial address field", async () => {
        render(
          <UpsertContactModal
            contact={{
              name: "",
              pkh: "invalid pkh",
            }}
          />
        );

        fireEvent.blur(screen.getByLabelText("Address"));

        await waitFor(() =>
          expect(screen.getByTestId("address-error")).toHaveTextContent("Invalid address")
        );
      });

      it("adds contact to address book with pre-filled address", async () => {
        store.dispatch(contactsActions.upsert(contact2));
        render(
          <UpsertContactModal
            contact={{
              name: "",
              pkh: contact1.pkh,
            }}
          />
        );

        // Set name
        fireEvent.change(screen.getByLabelText("Name"), {
          target: { value: "Test Contact" },
        });
        fireEvent.blur(screen.getByLabelText("Name"));
        // Submit
        await waitFor(() => expect(screen.getByTestId("confirmation-button")).toBeEnabled());
        fireEvent.click(screen.getByTestId("confirmation-button"));

        await waitFor(() =>
          expect(store.getState().contacts).toEqual({
            [contact2.pkh]: contact2,
            [contact1.pkh]: {
              name: "Test Contact",
              pkh: contact1.pkh,
            },
          })
        );
      });
    });
  });

  describe("on editing contact", () => {
    beforeEach(() => {
      store.dispatch(contactsActions.upsert(contact1));
    });

    it("shows correct title & button label", () => {
      render(<UpsertContactModal contact={contact1} />);

      expect(screen.getByRole("dialog")).toHaveTextContent("Edit Contact");
      expect(screen.getByTestId("confirmation-button")).toHaveTextContent("Update");
    });

    it("has uneditable address field", () => {
      render(<UpsertContactModal contact={contact1} />);

      expect(screen.getByLabelText("Address")).toHaveValue(contact1.pkh);
      expect(screen.getByLabelText("Address")).toBeDisabled();
    });

    it("checks the name was updated", async () => {
      render(<UpsertContactModal contact={contact1} />);

      fireEvent.blur(screen.getByLabelText("Name"));

      await waitFor(() =>
        expect(screen.getByTestId("name-error")).toHaveTextContent("Name was not changed")
      );
    });

    it("checks the name is unique", async () => {
      store.dispatch(contactsActions.upsert(contact2));
      render(<UpsertContactModal contact={contact1} />);

      fireEvent.change(screen.getByLabelText("Name"), {
        target: { value: contact2.name },
      });
      fireEvent.blur(screen.getByLabelText("Name"));

      await waitFor(() =>
        expect(screen.getByTestId("name-error")).toHaveTextContent(
          "Name must be unique across all accounts and contacts"
        )
      );
    });

    it("updates contact in address book", async () => {
      store.dispatch(contactsActions.upsert(contact2));
      render(<UpsertContactModal contact={contact1} />);

      // Update name
      fireEvent.change(screen.getByLabelText("Name"), {
        target: { value: "Updated Name" },
      });
      fireEvent.blur(screen.getByLabelText("Name"));

      // Submit
      await waitFor(() => expect(screen.getByTestId("confirmation-button")).toBeEnabled());
      fireEvent.click(screen.getByTestId("confirmation-button"));

      await waitFor(() =>
        expect(store.getState().contacts).toEqual({
          [contact2.pkh]: contact2,
          [contact1.pkh]: {
            name: "Updated Name",
            pkh: contact1.pkh,
          },
        })
      );
    });
  });
});
