import { UpsertContactModal } from "./ContactModal";
import { contact1, contact2 } from "../mocks/contacts";
import { mockImplicitAddress } from "../mocks/factories";
import { act, render, screen, userEvent, waitFor } from "../mocks/testUtils";
import { contactsActions } from "../utils/redux/slices/contactsSlice";
import { store } from "../utils/redux/store";

describe("UpsertContactModal", () => {
  describe("on adding contact", () => {
    describe.each([
      { testCase: "new contact", modalComponent: <UpsertContactModal /> },
      {
        testCase: "pre-set contact",
        modalComponent: (
          <UpsertContactModal
            contact={{
              name: "",
              pkh: mockImplicitAddress(0).pkh,
            }}
          />
        ),
      },
    ])("for $testCase", ({ modalComponent }) => {
      it("shows correct title & button label for new contact", () => {
        render(modalComponent);

        expect(screen.getByRole("dialog")).toHaveTextContent("Add Contact");
        expect(screen.getByTestId("confirmation-button")).toHaveTextContent("Add to Address Book");
      });

      it("has editable address & name fields", () => {
        render(modalComponent);

        expect(screen.getByLabelText("Address")).toBeEnabled();
        expect(screen.getByLabelText("Name")).toBeEnabled();
      });

      it("validates updated address", async () => {
        const user = userEvent;
        render(modalComponent);

        const addressInput = screen.getByLabelText("Address");
        await act(() => user.clear(addressInput));
        await act(() => user.type(addressInput, "invalid pkh"));
        // click outside of address input to trigger blur event
        await act(() => user.click(screen.getByTestId("confirmation-button")));

        await waitFor(() =>
          expect(screen.getByTestId("address-error")).toHaveTextContent("Invalid address")
        );
      });

      it("checks the name is unique", async () => {
        const user = userEvent;
        store.dispatch(contactsActions.upsert(contact2));
        render(modalComponent);

        const nameInput = screen.getByLabelText("Name");
        await act(() => user.clear(nameInput));
        await act(() => user.type(nameInput, contact2.name));
        // click outside of address input to trigger blur event
        await act(() => user.click(screen.getByTestId("confirmation-button")));

        await waitFor(() =>
          expect(screen.getByTestId("name-error")).toHaveTextContent(
            "Name must be unique across all accounts and contacts"
          )
        );
      });

      it("adds contact to address book", async () => {
        const user = userEvent;
        store.dispatch(contactsActions.upsert(contact2));
        render(modalComponent);

        // Set name
        const nameInput = screen.getByLabelText("Name");
        await act(() => user.clear(nameInput));
        await act(() => user.type(nameInput, "Test Contact"));
        // Set address
        const addressInput = screen.getByLabelText("Address");
        await act(() => user.clear(addressInput));
        await act(() => user.type(addressInput, mockImplicitAddress(5).pkh));
        // Submit
        await act(() => user.click(screen.getByTestId("confirmation-button")));

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
        const user = userEvent;
        render(
          <UpsertContactModal
            contact={{
              name: "",
              pkh: "invalid pkh",
            }}
          />
        );

        await act(() => user.click(screen.getByLabelText("Address")));
        // click outside of address input to trigger blur event
        await act(() => user.click(screen.getByTestId("confirmation-button")));

        await waitFor(() =>
          expect(screen.getByTestId("address-error")).toHaveTextContent("Invalid address")
        );
      });

      it("adds contact to address book with pre-filled address", async () => {
        const user = userEvent;
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
        const nameInput = screen.getByLabelText("Name");
        await act(() => user.clear(nameInput));
        await act(() => user.type(nameInput, "Test Contact"));
        // Submit
        await act(() => user.click(screen.getByTestId("confirmation-button")));

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
      const user = userEvent;
      render(<UpsertContactModal contact={contact1} />);

      await act(() => user.click(screen.getByLabelText("Name")));
      // click outside of address input to trigger blur event
      await act(() => user.click(screen.getByTestId("confirmation-button")));

      await waitFor(() =>
        expect(screen.getByTestId("name-error")).toHaveTextContent("Name was not changed")
      );
    });

    it("checks the name is unique", async () => {
      const user = userEvent;
      store.dispatch(contactsActions.upsert(contact2));
      render(<UpsertContactModal contact={contact1} />);

      const nameInput = screen.getByLabelText("Name");
      await act(() => user.clear(nameInput));
      await act(() => user.type(nameInput, contact2.name));
      // click outside of address input to trigger blur event
      await act(() => user.click(screen.getByTestId("confirmation-button")));

      await waitFor(() =>
        expect(screen.getByTestId("name-error")).toHaveTextContent(
          "Name must be unique across all accounts and contacts"
        )
      );
    });

    it("updates contact in address book", async () => {
      const user = userEvent;
      store.dispatch(contactsActions.upsert(contact2));
      render(<UpsertContactModal contact={contact1} />);

      // Update name
      const nameInput = screen.getByLabelText("Name");
      await act(() => user.clear(nameInput));
      await act(() => user.type(nameInput, "Updated Name"));
      // click outside of address input to trigger blur event
      await act(() => user.click(screen.getByTestId("confirmation-button")));

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
