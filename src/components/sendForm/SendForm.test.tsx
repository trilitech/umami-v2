/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import { Modal } from "@chakra-ui/react";

import { TezosNetwork } from "@airgap/tezos";
import {
  mockBaker,
  mockContract,
  mockImplicitAccount,
  mockNFT,
  mockPkh,
} from "../../mocks/factories";
import {
  dispatchMockAccounts,
  fakeRestoreFromMnemonic,
  fillAccountSelector,
  fillPassword,
  resetAccounts,
  setBatchEstimationPerTransaction,
} from "../../mocks/helpers";
import { fireEvent, render, screen, waitFor, within } from "../../mocks/testUtils";
import { AccountType, MnemonicAccount } from "../../types/Account";
import { FA12Token, FA2Token } from "../../types/Asset";
import { SignerType, SkSignerConfig } from "../../types/SignerConfig";
import { formatPkh } from "../../utils/format";
import * as accountUtils from "../../utils/hooks/accountUtils";
import assetsSlice, { BatchItem } from "../../utils/store/assetsSlice";
import { store } from "../../utils/store/store";
import { SendForm } from "./SendForm";
import { SendFormMode } from "./types";

import { Estimate } from "@taquito/taquito";
import { BatchWalletOperation } from "@taquito/taquito/dist/types/wallet/batch-operation";
import { mock } from "jest-mock-extended";
import { fakeTezosUtils } from "../../mocks/fakeTezosUtils";
import { mockToast } from "../../mocks/toast";

jest.mock("@chakra-ui/react", () => {
  return {
    ...jest.requireActual("@chakra-ui/react"),
    // Mock taost since it has an erratic behavior in RTL
    // https://github.com/chakra-ui/chakra-ui/issues/2969
    //
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    useToast: require("../../../src/mocks/toast").useToast,
  };
});

jest.mock("../../GoogleAuth", () => ({
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  GoogleAuth: require("../../mocks/GoogleAuthMock").GoogleAuthMock,
}));
jest.mock("../../utils/hooks/accountUtils");

const fakeAccountUtils = mock<typeof accountUtils>(accountUtils);

const fixture = (sender?: string, assetType?: SendFormMode) => (
  <Modal isOpen={true} onClose={() => {}}>
    <SendForm sender={sender} mode={assetType} />
  </Modal>
);

const MOCK_SK = "mockSk";

beforeEach(() => {
  fakeAccountUtils.useGetSk.mockReturnValue(() => Promise.resolve(MOCK_SK));
});
beforeEach(() => {
  document.getElementById("chakra-toast-portal")?.remove();
});
beforeAll(async () => {
  await store.dispatch(
    fakeRestoreFromMnemonic({
      seedFingerprint: "mockPrint",
      accounts: [
        mockImplicitAccount(1),
        mockImplicitAccount(2),
        mockImplicitAccount(3),
      ] as MnemonicAccount[],
    })
  );

  dispatchMockAccounts([
    mockImplicitAccount(4, AccountType.SOCIAL),
    mockImplicitAccount(5, AccountType.LEDGER),
  ]);
});

afterEach(() => {
  store.dispatch(assetsSlice.actions.reset());
});

afterAll(() => {
  resetAccounts();
});

describe("<SendForm />", () => {
  describe("case send tez", () => {
    test("should render first step with sender blank", () => {
      render(fixture());
      expect(screen.getByTestId(/account-selector/)).toHaveTextContent(/select an account/i);
    });
    test("should display tez currency name", () => {
      render(fixture());
      expect(screen.getByTestId(/currency/)).toHaveTextContent(/tez/i);
    });

    test("should render first step with sender prefiled if provided", () => {
      render(fixture(mockImplicitAccount(1).address.pkh));
      expect(screen.getByTestId(/account-selector/)).toHaveTextContent(
        formatPkh(mockImplicitAccount(1).address.pkh)
      );
    });

    const fillForm = async () => {
      render(fixture(mockImplicitAccount(1).address.pkh));
      expect(screen.getByTestId(/account-selector/)).toHaveTextContent(
        formatPkh(mockImplicitAccount(1).address.pkh)
      );

      const amountInput = screen.getByLabelText(/amount/i);
      fireEvent.change(amountInput, { target: { value: 23 } });

      const recipientInput = screen.getByLabelText(/to/i);
      fireEvent.change(recipientInput, { target: { value: mockPkh(7) } });
    };

    const fillFormAndSimulate = async () => {
      await fillForm();
      const submitBtn = screen.getByText(/preview/i);

      await waitFor(() => {
        expect(submitBtn).toBeEnabled();
      });

      fakeTezosUtils.estimateBatch.mockResolvedValue([
        {
          suggestedFeeMutez: 12345,
        } as Estimate,
      ]);

      fireEvent.click(submitBtn);

      await waitFor(() => {
        const subTotal = screen.getByLabelText(/^sub-total$/i);
        expect(subTotal).toHaveTextContent(/23 ꜩ/i);

        const fee = screen.getByLabelText(/^fee$/i);
        expect(fee).toHaveTextContent(/0.012345 ꜩ/i);

        const total = screen.getByLabelText(/^total$/i);
        expect(total).toHaveTextContent(/23.012345 ꜩ/i);
      });
    };

    it("should allow to add transaction to batch", async () => {
      await fillForm();

      setBatchEstimationPerTransaction(fakeTezosUtils.estimateBatch, 33);

      const addToBatchBtn = screen.getByRole("button", {
        name: /insert into batch/i,
      });
      await waitFor(() => {
        expect(addToBatchBtn).toBeEnabled();
      });

      fireEvent.click(addToBatchBtn);

      // Bellow code should not create act warning. This is a bug.
      //
      await waitFor(() => {
        const addToBatchBtn = screen.getByRole("button", {
          name: /insert into batch/i,
        });
        expect(addToBatchBtn).toBeDisabled();
      });

      // expect(mockToast).toHaveBeenCalledWith(/Transaction added to batch/i);
      await waitFor(() => {
        expect(mockToast).toHaveBeenCalled();
        // expect(screen.getByText(/Transaction added to batch/i)).toBeTruthy();
      });
      await waitFor(() => {
        const addToBatchBtn = screen.getByRole("button", {
          name: /insert into batch/i,
        });
        expect(addToBatchBtn).toBeEnabled();
      });
      const batch = store.getState().assets.batches[mockImplicitAccount(1).address.pkh];
      expect(batch).toEqual({
        isSimulating: false,
        items: [
          {
            fee: "33",
            operation: {
              type: "tez",
              value: {
                amount: "23000000",
                parameter: undefined,
                recipient: mockPkh(7),
                sender: mockPkh(1),
              },
            },
          },
        ],
      });

      setBatchEstimationPerTransaction(fakeTezosUtils.estimateBatch, 33);
      fireEvent.click(addToBatchBtn);
      await waitFor(() => {
        expect(addToBatchBtn).toBeDisabled();
      });

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledTimes(2);
      });

      const batch2 = store.getState().assets.batches[mockImplicitAccount(1).address.pkh];
      expect(batch2).toEqual({
        isSimulating: false,
        items: [
          {
            fee: "33",
            operation: {
              type: "tez",
              value: {
                amount: "23000000",
                recipient: mockPkh(7),
                sender: mockPkh(1),
              },
            },
          },
          {
            fee: "33",
            operation: {
              type: "tez",
              value: {
                amount: "23000000",
                recipient: mockPkh(7),
                sender: mockPkh(1),
              },
            },
          },
        ],
      });
    });

    test("should display simulation result: subtotal, fee and total", async () => {
      await fillFormAndSimulate();
    });

    test("it should submit transaction and not alter the user's batch", async () => {
      const mockBatchItems = [{} as BatchItem];
      store.dispatch(
        assetsSlice.actions.updateBatch({
          pkh: mockImplicitAccount(1).address.pkh,
          items: mockBatchItems,
        })
      );

      await fillFormAndSimulate();

      fakeTezosUtils.submitBatch.mockResolvedValueOnce({
        opHash: "foo",
      } as BatchWalletOperation);

      fillPassword("mockPass");

      const submit = screen.getByRole("button", {
        name: /submit transaction/i,
      });
      await waitFor(() => {
        expect(submit).toBeEnabled();
      });

      fireEvent.click(submit);
      await waitFor(() => {
        expect(screen.getByText(/Operation Submitted/i)).toBeTruthy();
      });
      expect(store.getState().assets.batches[mockImplicitAccount(1).address.pkh]?.items).toEqual(
        mockBatchItems
      );
    });

    test("it should submit transaction and display recap with tzkt link", async () => {
      await fillFormAndSimulate();

      fakeTezosUtils.submitBatch.mockResolvedValueOnce({
        opHash: "foo",
      } as BatchWalletOperation);

      fillPassword("mockPass");

      const submit = screen.getByRole("button", {
        name: /submit transaction/i,
      });
      await waitFor(() => {
        expect(submit).toBeEnabled();
      });

      fireEvent.click(submit);
      await waitFor(() => {
        expect(screen.getByText(/Operation Submitted/i)).toBeTruthy();
        expect(screen.getByTestId(/tzkt-link/i)).toHaveProperty(
          "href",
          "https://mainnet.tzkt.io/foo"
        );
      });
      const config: SkSignerConfig = {
        type: SignerType.SK,
        network: TezosNetwork.MAINNET,
        sk: MOCK_SK,
      };
      expect(fakeTezosUtils.submitBatch).toHaveBeenCalledWith(
        [
          {
            type: "tez",
            value: {
              amount: "23000000",
              parameter: undefined,
              recipient: mockPkh(7),
              sender: mockPkh(1),
            },
          },
        ],
        config
      );
    });
  });

  describe("case send FA2 tokens", () => {
    const MOCK_TOKEN_SYMBOL = "FOO";
    const MOCK_TOKEN_ID = "7";
    const MOCK_FEE = 3122;
    const mockFA2: FA2Token = {
      type: "fa2",
      contract: mockContract(2),
      tokenId: MOCK_TOKEN_ID,
      balance: "14760000",
      metadata: {
        symbol: MOCK_TOKEN_SYMBOL,
        decimals: "5",
      },
    };
    it("should display token name in amount input", () => {
      render(
        fixture(undefined, {
          type: "token",
          data: mockFA2,
        })
      );

      expect(screen.getByTestId(/currency/)).toHaveTextContent(MOCK_TOKEN_SYMBOL);
    });

    test("User fills form, does a transfer simulation, submits transaction and sees result hash", async () => {
      render(
        fixture(undefined, {
          type: "token",
          data: mockFA2,
        })
      );
      fillAccountSelector(mockImplicitAccount(2).label || "");

      const estimateButton = screen.getByText(/preview/i);
      expect(estimateButton).toBeDisabled();
      const recipientInput = screen.getByLabelText(/to/i);
      fireEvent.change(recipientInput, { target: { value: mockPkh(7) } });

      const amountInput = screen.getByLabelText(/amount/i);
      fireEvent.change(amountInput, { target: { value: 10 } });
      await waitFor(() => {
        expect(estimateButton).toBeEnabled();
      });

      setBatchEstimationPerTransaction(fakeTezosUtils.estimateBatch, MOCK_FEE);
      fireEvent.click(estimateButton);

      await waitFor(() => {
        const fee = screen.getByLabelText(/^fee$/i);
        expect(fee).toHaveTextContent(`${MOCK_FEE} ꜩ`);
      });

      expect(fakeTezosUtils.estimateBatch).toHaveBeenCalledWith(
        [
          {
            data: mockFA2,
            type: "token",
            value: {
              amount: "1000000",
              recipient: "tz1Kt4P8BCaP93AEV4eA7gmpRryWt5hznjCP",
              sender: "tz1ikfEcj3LmsmxpcC1RMZNzBHbEmybCc43D",
            },
          },
        ],
        "tz1ikfEcj3LmsmxpcC1RMZNzBHbEmybCc43D",
        "mainnet"
      );

      fillPassword("mockPass");

      fakeTezosUtils.submitBatch.mockResolvedValueOnce({
        opHash: "mockHash",
      } as BatchWalletOperation);

      const submit = screen.getByRole("button", {
        name: /submit transaction/i,
      });

      await waitFor(() => {
        expect(submit).toBeEnabled();
      });

      submit.click();

      await waitFor(() => {
        expect(screen.getByText(/Operation Submitted/i)).toBeTruthy();
        expect(screen.getByTestId(/tzkt-link/i)).toHaveProperty(
          "href",
          "https://mainnet.tzkt.io/mockHash"
        );
      });

      expect(fakeTezosUtils.submitBatch).toHaveBeenCalledWith(
        [
          {
            data: mockFA2,
            type: "token",
            value: {
              amount: "1000000",
              recipient: "tz1Kt4P8BCaP93AEV4eA7gmpRryWt5hznjCP",
              sender: "tz1ikfEcj3LmsmxpcC1RMZNzBHbEmybCc43D",
            },
          },
        ],
        {
          network: "mainnet",
          sk: "mockSk",
          type: "sk",
        }
      );
    });
  });

  describe("case send FA1 tokens", () => {
    const MOCK_TOKEN_SYMBOL = "FA1FOO";
    const MOCK_FEE = 4122;

    const mockFa1: FA12Token = {
      type: "fa1.2",
      contract: mockContract(2),
      balance: "3",
      metadata: {
        symbol: MOCK_TOKEN_SYMBOL,
        decimals: "8",
      },
    };
    it("should display token name in amount input", () => {
      render(
        fixture(undefined, {
          type: "token",
          data: mockFa1,
        })
      );

      expect(screen.getByTestId(/currency/)).toHaveTextContent(MOCK_TOKEN_SYMBOL);
    });

    test("User fills form, does a transfer simulation, submits transaction and sees result hash", async () => {
      render(
        fixture(undefined, {
          type: "token",
          data: mockFa1,
        })
      );
      fillAccountSelector(mockImplicitAccount(2).label || "");

      const estimateButton = screen.getByText(/preview/i);
      expect(estimateButton).toBeDisabled();
      const recipientInput = screen.getByLabelText(/to/i);
      fireEvent.change(recipientInput, { target: { value: mockPkh(7) } });

      const amountInput = screen.getByLabelText(/amount/i);
      fireEvent.change(amountInput, { target: { value: 10 } });
      await waitFor(() => {
        expect(estimateButton).toBeEnabled();
      });

      setBatchEstimationPerTransaction(fakeTezosUtils.estimateBatch, MOCK_FEE);

      fireEvent.click(estimateButton);

      await waitFor(() => {
        const fee = screen.getByLabelText(/^fee$/i);
        expect(fee).toHaveTextContent(`${MOCK_FEE} ꜩ`);
      });

      expect(fakeTezosUtils.estimateBatch).toHaveBeenCalledWith(
        [
          {
            data: mockFa1,
            type: "token",
            value: {
              amount: "1000000000",
              recipient: "tz1Kt4P8BCaP93AEV4eA7gmpRryWt5hznjCP",
              sender: "tz1ikfEcj3LmsmxpcC1RMZNzBHbEmybCc43D",
            },
          },
        ],
        "tz1ikfEcj3LmsmxpcC1RMZNzBHbEmybCc43D",
        "mainnet"
      );

      fillPassword("mockPass");
      fakeTezosUtils.submitBatch.mockResolvedValueOnce({
        opHash: "mockHash",
      } as BatchWalletOperation);

      const submit = screen.getByRole("button", {
        name: /submit transaction/i,
      });

      await waitFor(() => {
        expect(submit).toBeEnabled();
      });

      submit.click();

      await waitFor(() => {
        expect(screen.getByText(/Operation Submitted/i)).toBeTruthy();
        expect(screen.getByTestId(/tzkt-link/i)).toHaveProperty(
          "href",
          "https://mainnet.tzkt.io/mockHash"
        );
      });

      expect(fakeTezosUtils.submitBatch).toHaveBeenCalledWith(
        [
          {
            data: mockFa1,
            type: "token",
            value: {
              amount: "1000000000",
              recipient: "tz1Kt4P8BCaP93AEV4eA7gmpRryWt5hznjCP",
              sender: "tz1ikfEcj3LmsmxpcC1RMZNzBHbEmybCc43D",
            },
          },
        ],
        { network: "mainnet", sk: "mockSk", type: "sk" }
      );
    });
  });

  describe("case send NFT", () => {
    const fillFormAndSimulate = async () => {
      render(fixture(undefined, { type: "token", data: mockNFT(1) }));
      expect(screen.getByTestId(/account-selector/)).toHaveTextContent(
        formatPkh(mockImplicitAccount(1).address.pkh)
      );

      // const amountInput = screen.getByLabelText(/amount/i);
      // fireEvent.change(amountInput, { target: { value: "23" } });

      const recipientInput = screen.getByLabelText(/to/i);
      fireEvent.change(recipientInput, { target: { value: mockPkh(7) } });

      const submitBtn = screen.getByText(/preview/i);

      await waitFor(() => {
        expect(submitBtn).toBeEnabled();
      });

      setBatchEstimationPerTransaction(fakeTezosUtils.estimateBatch, 3654);
      fireEvent.click(submitBtn);

      await waitFor(() => {
        const fee = screen.getByLabelText(/^fee$/i);
        expect(fee).toHaveTextContent(/0.003654 ꜩ/i);

        const nft = screen.getByLabelText(/^nft$/i);
        expect(within(nft).getByRole("img")).toHaveProperty(
          "src",
          "https://ipfs.io/ipfs/zdj7Wk92xWxpzGqT6sE4cx7umUyWaX2Ck8MrSEmPAR31sNWG1"
        );
      });
    };
    it("should display editions in amount input", () => {
      render(fixture(undefined, { type: "token", data: mockNFT(1) }));

      expect(screen.getByTestId(/currency/)).toHaveTextContent("editions");
    });

    test("sender button is disabled and prefilled with NFT owner", () => {
      render(fixture(undefined, { type: "token", data: mockNFT(1) }));

      expect(screen.getByTestId(/account-selector/)).toHaveTextContent(formatPkh(mockNFT(1).owner));

      expect(screen.getByTestId(/account-selector/)).toBeDisabled();
    });

    test("should display simulation result: NFT image, fee and total", async () => {
      await fillFormAndSimulate();
    });

    test("it should transfer NFT and display recap with tzktLink", async () => {
      await fillFormAndSimulate();

      fillPassword("mockPass");
      fakeTezosUtils.submitBatch.mockResolvedValueOnce({
        opHash: "mockHash",
      } as BatchWalletOperation);

      const submit = screen.getByRole("button", {
        name: /submit transaction/i,
      });

      await waitFor(() => {
        expect(submit).toBeEnabled();
      });
      fireEvent.click(submit);

      await waitFor(() => {
        expect(screen.getByText(/Operation Submitted/i)).toBeTruthy();
        expect(screen.getByTestId(/tzkt-link/i)).toHaveProperty(
          "href",
          "https://mainnet.tzkt.io/mockHash"
        );
      });
      const config: SkSignerConfig = {
        type: SignerType.SK,
        network: TezosNetwork.MAINNET,
        sk: MOCK_SK,
      };
      expect(fakeTezosUtils.submitBatch).toHaveBeenCalledWith(
        [
          {
            data: mockNFT(1),
            type: "token",
            value: {
              amount: "1",
              recipient: "tz1Kt4P8BCaP93AEV4eA7gmpRryWt5hznjCP",
              sender: "tz1UZFB9kGauB6F5c2gfJo4hVcvrD8MeJ3Vf",
            },
          },
        ],
        config
      );
    });
  });

  describe("case delegations", () => {
    beforeAll(() => {
      const { updateBakers } = assetsSlice.actions;
      store.dispatch(updateBakers([mockBaker(1), mockBaker(2), mockBaker(3)]));
    });

    test("it displays delegation form form", async () => {
      render(fixture(undefined, { type: "delegation" }));

      expect(screen.getByText(/delegate/i)).toBeTruthy();

      const bakerInput = screen.getByTestId(/baker-selector/i);
      fireEvent.change(bakerInput, {
        target: { value: mockBaker(2).address },
      });
    });

    // Can't find a way to itneract with Chakra select boxes with Testing Library.
    // So it's impossible to do a fill use case.
    // TODO investigate this

    // test("User can simulate and execute delegations to bakers", async () => {
    //   render(fixture(undefined, { type: "delegation" }));
    //   const senderInput = screen.getByText(/select an account/i);
    //   fireEvent.click(senderInput);
    //   // userEvent.selectOptions(senderInput, mockAccount(1).address.pkh);
    // });
  });
  describe("case send tez with Google account", () => {
    const fillForm = async () => {
      render(fixture(mockImplicitAccount(4, AccountType.SOCIAL).address.pkh));

      const amountInput = screen.getByLabelText(/amount/i);
      fireEvent.change(amountInput, { target: { value: 23 } });

      const recipientInput = screen.getByLabelText(/to/i);
      fireEvent.change(recipientInput, { target: { value: mockPkh(7) } });

      const submitBtn = screen.getByText(/preview/i);

      await waitFor(() => {
        expect(submitBtn).toBeEnabled();
      });

      setBatchEstimationPerTransaction(fakeTezosUtils.estimateBatch, 12345);
      fireEvent.click(submitBtn);

      await waitFor(() => {
        const subTotal = screen.getByLabelText(/^sub-total$/i);
        expect(subTotal).toHaveTextContent(/23 ꜩ/i);

        const fee = screen.getByLabelText(/^fee$/i);
        expect(fee).toHaveTextContent(/0.012345 ꜩ/i);

        const total = screen.getByLabelText(/^total$/i);
        expect(total).toHaveTextContent(/23.012345 ꜩ/i);
      });
    };
    test("It doesn't display password in SubmitStep", async () => {
      await fillForm();
      expect(screen.getByRole("button", { name: /sign with google/i })).toBeTruthy();
      expect(screen.queryByLabelText(/password/i)).not.toBeInTheDocument();
    });

    test("Clicking on submit transaction signs with google private key and shows operation submitted message", async () => {
      await fillForm();

      const googleSSOBtn = screen.getByText(/sign with google/i);

      fakeTezosUtils.submitBatch.mockResolvedValueOnce({
        opHash: "foo",
      } as BatchWalletOperation);

      fireEvent.click(googleSSOBtn);

      await waitFor(() => {
        expect(screen.getByText(/Operation Submitted/i)).toBeTruthy();
        expect(screen.getByTestId(/tzkt-link/i)).toHaveProperty(
          "href",
          "https://mainnet.tzkt.io/foo"
        );
      });
    });
  });

  describe("case send tez with Ledger account", () => {
    const fillForm = async () => {
      render(fixture(mockImplicitAccount(5, AccountType.LEDGER).address.pkh));

      const amountInput = screen.getByLabelText(/amount/i);
      fireEvent.change(amountInput, { target: { value: 23 } });

      const recipientInput = screen.getByLabelText(/to/i);
      fireEvent.change(recipientInput, { target: { value: mockPkh(7) } });

      const submitBtn = screen.getByText(/preview/i);

      await waitFor(() => {
        expect(submitBtn).toBeEnabled();
      });

      setBatchEstimationPerTransaction(fakeTezosUtils.estimateBatch, 12345);

      fireEvent.click(submitBtn);

      await waitFor(() => {
        const subTotal = screen.getByLabelText(/^sub-total$/i);
        expect(subTotal).toHaveTextContent(/23 ꜩ/i);

        const fee = screen.getByLabelText(/^fee$/i);
        expect(fee).toHaveTextContent(/0.012345 ꜩ/i);

        const total = screen.getByLabelText(/^total$/i);
        expect(total).toHaveTextContent(/23.012345 ꜩ/i);
      });
    };
    test("It doesn't display password in SubmitStep", async () => {
      await fillForm();
      expect(screen.getByRole("button", { name: /sign with ledger/i })).toBeTruthy();
      expect(screen.queryByLabelText(/password/i)).not.toBeInTheDocument();
    });

    test("Clicking on submit transaction signs with ledger and shows operation submitted message", async () => {
      await fillForm();

      const ledgerBtn = screen.getByText(/sign with ledger/i);

      fakeTezosUtils.submitBatch.mockResolvedValueOnce({
        opHash: "foo",
      } as BatchWalletOperation);

      fireEvent.click(ledgerBtn);

      await waitFor(() => {
        expect(screen.getByText(/Operation Submitted/i)).toBeTruthy();
        expect(screen.getByTestId(/tzkt-link/i)).toHaveProperty(
          "href",
          "https://mainnet.tzkt.io/foo"
        );
      });
    });
  });
});
