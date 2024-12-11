import { estimate, makeAccountOperations, mockImplicitAccount, mockNFTBalance } from "@umami/core";
import {
  type UmamiStore,
  accountsActions,
  addTestAccount,
  makeStore,
  mockToast,
} from "@umami/state";
import { executeParams } from "@umami/test-utils";
import { parseContractPkh } from "@umami/tezos";

import { FormPage } from "./FormPage";
import { SignPage } from "./SignPage";
import {
  act,
  dynamicModalContextMock,
  fireEvent,
  renderInModal,
  screen,
  userEvent,
  waitFor,
} from "../../../testUtils";

jest.mock("@umami/core", () => ({
  ...jest.requireActual("@umami/core"),
  estimate: jest.fn(),
}));

jest.mock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  useBreakpointValue: jest.fn(),
}));

const sender = mockImplicitAccount(0);
const nft = mockNFTBalance(1, { balance: "1" });

let store: UmamiStore;

beforeEach(() => {
  store = makeStore();
  addTestAccount(store, sender);
  store.dispatch(accountsActions.setCurrent(sender.address.pkh));
});

describe("<FormPage />", () => {
  it("renders a form with default form values", async () => {
    await renderInModal(
      <FormPage
        form={{
          sender: mockImplicitAccount(0).address.pkh,
          quantity: 1,
          recipient: mockImplicitAccount(1).address.pkh,
        }}
        nft={nft}
      />,
      store
    );

    await waitFor(() =>
      expect(screen.getByTestId("real-address-input-recipient")).toHaveValue(
        mockImplicitAccount(1).address.pkh
      )
    );
    expect(screen.getByTestId("quantity-input")).toHaveValue(1);
  });

  describe("nft", () => {
    it("displays the correct name", async () => {
      await renderInModal(<FormPage nft={nft} />, store);

      expect(screen.getByTestId("nft-name")).toHaveTextContent(nft.metadata.name as string);
    });

    it("renders the correct balance", async () => {
      await renderInModal(<FormPage nft={mockNFTBalance(1, { balance: "10" })} />, store);

      expect(screen.getByTestId("nft-owned")).toHaveTextContent("10");
    });
  });

  describe("validation", () => {
    describe("To", () => {
      it("is required", async () => {
        await renderInModal(<FormPage nft={nft} />, store);

        fireEvent.blur(screen.getByLabelText("To"));
        await waitFor(() => {
          expect(screen.getByTestId("recipient-error")).toHaveTextContent(
            "Invalid address or contact"
          );
        });
      });

      it("allows only valid addresses", async () => {
        await renderInModal(<FormPage nft={nft} />, store);

        fireEvent.change(screen.getByLabelText("To"), {
          target: { value: "invalid" },
        });
        await waitFor(() => {
          expect(screen.getByTestId("recipient-error")).toHaveTextContent(
            "Invalid address or contact"
          );
        });

        fireEvent.change(screen.getByLabelText("To"), {
          target: { value: mockImplicitAccount(0).address.pkh },
        });

        await waitFor(() => {
          expect(screen.queryByTestId("recipient-error")).not.toBeInTheDocument();
        });
      });
    });

    describe("quantity", () => {
      it("doesn't allow values < 1", async () => {
        await renderInModal(<FormPage nft={nft} />, store);
        fireEvent.change(screen.getByTestId("quantity-input"), {
          target: { value: "0" },
        });
        fireEvent.blur(screen.getByTestId("quantity-input"));
        await waitFor(() => {
          expect(screen.getByTestId("quantity-error")).toHaveTextContent("Min quantity is 1");
        });
      });

      it("doesn't allow values above the nft balance", async () => {
        await renderInModal(<FormPage nft={mockNFTBalance(1, { balance: "5" })} />, store);
        fireEvent.change(screen.getByTestId("quantity-input"), {
          target: { value: "7" },
        });
        fireEvent.blur(screen.getByTestId("quantity-input"));
        await waitFor(() => {
          expect(screen.getByTestId("quantity-error")).toHaveTextContent("Max quantity is 5");
        });
      });
    });

    describe("single transaction", () => {
      it("opens a sign page if estimation succeeds", async () => {
        const user = userEvent.setup();

        await renderInModal(
          <FormPage
            form={{
              sender: sender.address.pkh,
              recipient: mockImplicitAccount(1).address.pkh,
              quantity: 1,
            }}
            nft={nft}
          />,
          store
        );
        const submitButton = screen.getByText("Preview");
        await waitFor(() => {
          expect(submitButton).toBeEnabled();
        });

        const operations = {
          ...makeAccountOperations(sender, mockImplicitAccount(0), [
            {
              type: "fa2",
              amount: "1",
              sender: sender.address,
              recipient: mockImplicitAccount(1).address,
              contract: parseContractPkh(mockNFTBalance(1).contract),
              tokenId: mockNFTBalance(1).tokenId,
            },
          ]),
          estimates: [executeParams()],
        };

        jest.mocked(estimate).mockResolvedValueOnce(operations);

        await act(() => user.click(submitButton));

        expect(dynamicModalContextMock.openWith).toHaveBeenCalledWith(
          <SignPage nft={mockNFTBalance(1)} operations={operations} />
        );
        expect(mockToast).not.toHaveBeenCalled();
      });
    });
  });
});
