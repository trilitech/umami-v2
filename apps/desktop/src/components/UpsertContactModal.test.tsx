import { mockImplicitContact } from "@umami/core";
import { getNetworksForContracts } from "@umami/multisig";
import { type UmamiStore, contactsActions, makeStore, mockToast } from "@umami/state";
import { mockContractAddress, mockImplicitAddress } from "@umami/tezos";

import { UpsertContactModal } from "./UpsertContactModal";
import { act, render, screen, userEvent, waitFor } from "../mocks/testUtils";

jest.mock("@umami/multisig", () => ({
  ...jest.requireActual("@umami/multisig"),
  getNetworksForContracts: jest.fn(),
}));

const contact1 = mockImplicitContact(1);
const contact2 = mockImplicitContact(2);

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
});

describe("<UpsertContactModal />", () => {
  describe("on adding contact", () => {
    const contractPkh = mockContractAddress(0).pkh;

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
        render(modalComponent, { store });

        expect(screen.getByRole("dialog")).toHaveTextContent("Add Contact");
        expect(screen.getByTestId("confirmation-button")).toHaveTextContent("Add to Address Book");
      });

      it("has editable address & name fields", () => {
        render(modalComponent, { store });

        expect(screen.getByLabelText("Address")).toBeEnabled();
        expect(screen.getByLabelText("Name")).toBeEnabled();
      });

      it("validates updated address", async () => {
        const user = userEvent.setup();
        render(modalComponent, { store });

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
        const user = userEvent.setup();
        store.dispatch(contactsActions.upsert(contact2));
        render(modalComponent, { store });

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
        const user = userEvent.setup();
        store.dispatch(contactsActions.upsert(contact2));
        render(modalComponent, { store });

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

      it("fetches network for contract addresses", async () => {
        jest
          .mocked(getNetworksForContracts)
          .mockResolvedValue(new Map([[contractPkh, "ghostnet"]]));
        const user = userEvent.setup();
        render(modalComponent, { store });

        // Set name
        const nameInput = screen.getByLabelText("Name");
        await act(() => user.clear(nameInput));
        await act(() => user.type(nameInput, "Test Contact"));
        // Set address
        const addressInput = screen.getByLabelText("Address");
        await act(() => user.clear(addressInput));
        await act(() => user.type(addressInput, contractPkh));
        // Submit
        await act(() => user.click(screen.getByTestId("confirmation-button")));

        await waitFor(() =>
          expect(store.getState().contacts).toEqual({
            [contractPkh]: {
              name: "Test Contact",
              pkh: contractPkh,
              network: "ghostnet",
            },
          })
        );
      });

      it("shows error toast on unknown network for contract addresses", async () => {
        jest.mocked(getNetworksForContracts).mockResolvedValue(new Map());
        const user = userEvent.setup();
        render(modalComponent, { store });

        // Set name
        const nameInput = screen.getByLabelText("Name");
        await act(() => user.clear(nameInput));
        await act(() => user.type(nameInput, "Test Contact"));
        // Set address
        const addressInput = screen.getByLabelText("Address");
        await act(() => user.clear(addressInput));
        await act(() => user.type(addressInput, contractPkh));
        // Submit
        await act(() => user.click(screen.getByTestId("confirmation-button")));

        expect(mockToast).toHaveBeenCalledWith({
          description: `Network not found for contract ${contractPkh}`,
          status: "error",
          isClosable: true,
        });
        expect(store.getState().contacts).toEqual({});
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
          />,
          { store }
        );

        expect(screen.getByLabelText("Address")).toHaveValue(mockImplicitAddress(0).pkh);
      });

      it("validates initial address field", async () => {
        const user = userEvent.setup();
        render(
          <UpsertContactModal
            contact={{
              name: "",
              pkh: "invalid pkh",
            }}
          />,
          { store }
        );

        await act(() => user.click(screen.getByLabelText("Address")));
        // click outside of address input to trigger blur event
        await act(() => user.click(screen.getByTestId("confirmation-button")));

        await waitFor(() =>
          expect(screen.getByTestId("address-error")).toHaveTextContent("Invalid address")
        );
      });

      it("adds contact to address book with pre-filled address", async () => {
        const user = userEvent.setup();
        store.dispatch(contactsActions.upsert(contact2));
        render(
          <UpsertContactModal
            contact={{
              name: "",
              pkh: contact1.pkh,
            }}
          />,
          { store }
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

      it("fetches network for contract addresses", async () => {
        jest
          .mocked(getNetworksForContracts)
          .mockResolvedValue(new Map([[contractPkh, "ghostnet"]]));
        const user = userEvent.setup();
        render(
          <UpsertContactModal
            contact={{
              name: "",
              pkh: contractPkh,
            }}
          />,
          { store }
        );

        // Set name
        const nameInput = screen.getByLabelText("Name");
        await act(() => user.clear(nameInput));
        await act(() => user.type(nameInput, "Test Contact"));
        // Submit
        await act(() => user.click(screen.getByTestId("confirmation-button")));

        await waitFor(() =>
          expect(store.getState().contacts).toEqual({
            [contractPkh]: {
              name: "Test Contact",
              pkh: contractPkh,
              network: "ghostnet",
            },
          })
        );
      });

      it("shows error toast on unknown network for contract addresses", async () => {
        jest.mocked(getNetworksForContracts).mockResolvedValue(new Map());
        const user = userEvent.setup();
        render(
          <UpsertContactModal
            contact={{
              name: "",
              pkh: contractPkh,
            }}
          />,
          { store }
        );

        // Set name
        const nameInput = screen.getByLabelText("Name");
        await act(() => user.clear(nameInput));
        await act(() => user.type(nameInput, "Test Contact"));
        // Submit
        await act(() => user.click(screen.getByTestId("confirmation-button")));

        expect(mockToast).toHaveBeenCalledWith({
          description: `Network not found for contract ${contractPkh}`,
          status: "error",
          isClosable: true,
        });
        expect(store.getState().contacts).toEqual({});
      });
    });
  });

  describe("on editing contact", () => {
    beforeEach(() => {
      store.dispatch(contactsActions.upsert(contact1));
    });

    it("shows correct title & button label", () => {
      render(<UpsertContactModal contact={contact1} />, { store });

      expect(screen.getByRole("dialog")).toHaveTextContent("Edit Contact");
      expect(screen.getByTestId("confirmation-button")).toHaveTextContent("Update");
    });

    it("has uneditable address field", () => {
      render(<UpsertContactModal contact={contact1} />, { store });

      expect(screen.getByLabelText("Address")).toHaveValue(contact1.pkh);
      expect(screen.getByLabelText("Address")).toBeDisabled();
    });

    it("checks the name was updated", async () => {
      const user = userEvent.setup();
      render(<UpsertContactModal contact={contact1} />, { store });

      await act(() => user.click(screen.getByLabelText("Name")));
      // click outside of address input to trigger blur event
      await act(() => user.click(screen.getByTestId("confirmation-button")));

      await waitFor(() =>
        expect(screen.getByTestId("name-error")).toHaveTextContent("Name was not changed")
      );
    });

    it("checks the name is unique", async () => {
      const user = userEvent.setup();
      store.dispatch(contactsActions.upsert(contact2));
      render(<UpsertContactModal contact={contact1} />, { store });

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
      const user = userEvent.setup();
      store.dispatch(contactsActions.upsert(contact2));
      render(<UpsertContactModal contact={contact1} />, { store });

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
