import { mockImplicitContact } from "@umami/core";
import { getNetworksForContracts } from "@umami/multisig";
import { type UmamiStore, contactsActions, makeStore, mockToast } from "@umami/state";
import { mockContractAddress, mockImplicitAddress } from "@umami/tezos";

import { AddContactModal } from "./AddContactModal";
import { act, renderInModal, screen, userEvent, waitFor } from "../../testUtils";

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

describe("<AddContactModal />", () => {
  const contractPkh = mockContractAddress(0).pkh;

  it("has pre-filled address field", async () => {
    await renderInModal(<AddContactModal pkh={mockImplicitAddress(0).pkh} />, store);

    expect(screen.getByLabelText("Address")).toHaveValue(mockImplicitAddress(0).pkh);
  });

  it("validates initial address field", async () => {
    const user = userEvent.setup();
    await renderInModal(<AddContactModal pkh="invalid pkh" />, store);

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
    await renderInModal(<AddContactModal pkh={contact1.pkh} />, store);

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
    jest.mocked(getNetworksForContracts).mockResolvedValue(new Map([[contractPkh, "ghostnet"]]));
    const user = userEvent.setup();
    await renderInModal(<AddContactModal pkh={contractPkh} />, store);

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
    await renderInModal(<AddContactModal pkh={contractPkh} />, store);

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
