/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import { Modal } from "@chakra-ui/react";

import {
  mockBaker,
  mockContractAddress,
  mockImplicitAccount,
  mockNFT,
  mockImplicitAddress,
} from "../../mocks/factories";
import {
  dispatchMockAccounts,
  fakeRestoreFromMnemonic,
  selectSender,
  fillPassword,
  setBatchEstimationPerTransaction,
} from "../../mocks/helpers";
import { fireEvent, render, screen, waitFor, within } from "../../mocks/testUtils";
import { AccountType, MnemonicAccount } from "../../types/Account";
import {
  FA12TokenBalance,
  FA2TokenBalance,
  fromRaw,
  TokenBalanceWithToken,
} from "../../types/TokenBalance";
import { SignerType, SkSignerConfig } from "../../types/SignerConfig";
import * as accountUtils from "../../utils/hooks/accountUtils";
import assetsSlice, { BatchItem } from "../../utils/store/assetsSlice";
import { store } from "../../utils/store/store";
import { SendForm } from "./SendForm";
import { SendFormMode } from "./types";

import { Estimate, TransactionOperation } from "@taquito/taquito";
import { BatchWalletOperation } from "@taquito/taquito/dist/types/wallet/batch-operation";
import { mock } from "jest-mock-extended";
import { fakeTezosUtils } from "../../mocks/fakeTezosUtils";
import { mockToast } from "../../mocks/toast";
import { multisigActions } from "../../utils/store/multisigsSlice";
import { multisigs } from "../../mocks/multisig";
import { parseContractPkh, parseImplicitPkh, parsePkh } from "../../types/Address";
import tokensSlice from "../../utils/store/tokensSlice";
import { fa1Token, fa2Token, nft } from "../../mocks/tzktResponse";
import { TezosNetwork } from "../../types/TezosNetwork";

// These tests might take long in the CI
jest.setTimeout(10000);

jest.mock("../../multisig/multisigUtils");
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

const fixture = (sender: string, mode: SendFormMode) => (
  <Modal isOpen={true} onClose={() => {}}>
    <SendForm sender={sender} mode={mode} />
  </Modal>
);

const MOCK_SK = "mockSk";
const MOCK_PKH = mockImplicitAccount(1).address.pkh;

beforeEach(async () => {
  fakeAccountUtils.useGetSk.mockReturnValue(() => Promise.resolve(MOCK_SK));
  document.getElementById("chakra-toast-portal")?.remove();
  store.dispatch(
    tokensSlice.actions.addTokens({
      network: TezosNetwork.MAINNET,
      tokens: [fa1Token.token, fa2Token.token, nft.token],
    })
  );
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

  store.dispatch(multisigActions.setMultisigs(multisigs));
});

describe("<SendForm />", () => {
  describe("case send tez", () => {
    test("should display tez currency name", () => {
      render(fixture(MOCK_PKH, { type: "tez" }));
      expect(screen.getByTestId(/currency/)).toHaveTextContent(/tez/i);
    });

    test("should render first step", () => {
      render(fixture(MOCK_PKH, { type: "tez" }));
      expect(screen.getByTestId("real-address-input-sender")).toHaveAttribute("value", MOCK_PKH);
    });

    const fillForm = async () => {
      render(fixture(MOCK_PKH, { type: "tez" }));
      expect(screen.getByTestId("real-address-input-sender")).toHaveAttribute("value", MOCK_PKH);

      const amountInput = screen.getByLabelText(/amount/i);
      fireEvent.change(amountInput, { target: { value: 23 } });

      const recipientInput = screen.getByLabelText(/to/i);
      fireEvent.change(recipientInput, { target: { value: mockImplicitAddress(7).pkh } });
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
      const batch = store.getState().assets.batches[MOCK_PKH];
      expect(batch).toEqual({
        isSimulating: false,
        items: [
          {
            fee: "33",
            operation: {
              type: "tez",
              amount: "23000000",
              parameter: undefined,
              recipient: mockImplicitAddress(7),
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

      const batch2 = store.getState().assets.batches[MOCK_PKH];
      expect(batch2).toEqual({
        isSimulating: false,
        items: [
          {
            fee: "33",
            operation: {
              type: "tez",
              amount: "23000000",
              recipient: mockImplicitAddress(7),
            },
          },
          {
            fee: "33",
            operation: {
              type: "tez",
              amount: "23000000",
              recipient: mockImplicitAddress(7),
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
          pkh: MOCK_PKH,
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
      expect(store.getState().assets.batches[MOCK_PKH]?.items).toEqual(mockBatchItems);
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
            amount: "23000000",
            parameter: undefined,
            recipient: mockImplicitAddress(7),
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
    const mockFA2: FA2TokenBalance = {
      type: "fa2",
      contract: mockContractAddress(2).pkh,
      tokenId: MOCK_TOKEN_ID,
      balance: "14760000",
      metadata: {
        symbol: MOCK_TOKEN_SYMBOL,
        decimals: "5",
      },
    };

    it("should display token name in amount input", () => {
      render(
        fixture(MOCK_PKH, {
          type: "token",
          data: mockFA2,
        })
      );

      expect(screen.getByTestId(/currency/)).toHaveTextContent(MOCK_TOKEN_SYMBOL);
    });

    test("User fills form, does a transfer simulation, submits transaction and sees result hash", async () => {
      render(
        fixture(MOCK_PKH, {
          type: "token",
          data: mockFA2,
        })
      );
      selectSender(mockImplicitAccount(2).label);

      const estimateButton = screen.getByText(/preview/i);
      expect(estimateButton).toBeDisabled();
      const recipientInput = screen.getByLabelText(/to/i);
      fireEvent.change(recipientInput, { target: { value: mockImplicitAddress(7).pkh } });

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
            type: "fa2",
            amount: "1000000",
            recipient: parsePkh("tz1Kt4P8BCaP93AEV4eA7gmpRryWt5hznjCP"),
            sender: parsePkh("tz1ikfEcj3LmsmxpcC1RMZNzBHbEmybCc43D"),
            contract: parseContractPkh(mockFA2.contract),
            tokenId: mockFA2.tokenId,
          },
        ],
        "tz1ikfEcj3LmsmxpcC1RMZNzBHbEmybCc43D",
        "edpkuwYWCugiYG7nMnVUdopFmyc3sbMSiLqsJHTQgGtVhtSdLSw6H2",
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
            type: "fa2",
            amount: "1000000",
            recipient: parsePkh("tz1Kt4P8BCaP93AEV4eA7gmpRryWt5hznjCP"),
            sender: parsePkh("tz1ikfEcj3LmsmxpcC1RMZNzBHbEmybCc43D"),
            contract: parseContractPkh(mockFA2.contract),
            tokenId: mockFA2.tokenId,
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

    const mockFa1: FA12TokenBalance = {
      type: "fa1.2",
      contract: mockContractAddress(2).pkh,
      tokenId: "0",
      balance: "3",
      metadata: {
        symbol: MOCK_TOKEN_SYMBOL,
        decimals: "8",
      },
    };
    it("should display token name in amount input", () => {
      render(
        fixture(MOCK_PKH, {
          type: "token",
          data: mockFa1,
        })
      );

      expect(screen.getByTestId(/currency/)).toHaveTextContent(MOCK_TOKEN_SYMBOL);
    });

    test("User fills form, does a transfer simulation, submits transaction and sees result hash", async () => {
      render(
        fixture(MOCK_PKH, {
          type: "token",
          data: mockFa1,
        })
      );
      selectSender(mockImplicitAccount(2).label);

      const estimateButton = screen.getByText(/preview/i);
      expect(estimateButton).toBeDisabled();
      const recipientInput = screen.getByLabelText(/to/i);
      fireEvent.change(recipientInput, { target: { value: mockImplicitAddress(7).pkh } });

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
            type: "fa1.2",
            amount: "1000000000",
            recipient: parsePkh("tz1Kt4P8BCaP93AEV4eA7gmpRryWt5hznjCP"),
            sender: parsePkh("tz1ikfEcj3LmsmxpcC1RMZNzBHbEmybCc43D"),
            contract: parseContractPkh(mockFa1.contract),
            tokenId: "0",
          },
        ],
        "tz1ikfEcj3LmsmxpcC1RMZNzBHbEmybCc43D",
        "edpkuwYWCugiYG7nMnVUdopFmyc3sbMSiLqsJHTQgGtVhtSdLSw6H2",
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
            type: "fa1.2",
            amount: "1000000000",
            recipient: parsePkh("tz1Kt4P8BCaP93AEV4eA7gmpRryWt5hznjCP"),
            sender: parsePkh("tz1ikfEcj3LmsmxpcC1RMZNzBHbEmybCc43D"),
            contract: parseContractPkh(mockFa1.contract),
            tokenId: "0",
          },
        ],
        { network: "mainnet", sk: "mockSk", type: "sk" }
      );
    });
  });

  describe("case send NFT", () => {
    const fillFormAndSimulate = async () => {
      render(fixture(MOCK_PKH, { type: "token", data: fromRaw(nft) as TokenBalanceWithToken }));
      expect(screen.getByTestId("real-address-input-sender")).toHaveAttribute(
        "value",
        mockImplicitAccount(1).address.pkh
      );

      const recipientInput = screen.getByLabelText(/to/i);
      fireEvent.change(recipientInput, { target: { value: mockImplicitAddress(7).pkh } });

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
          "https://ipfs.io/ipfs/zdj7Wk92xWxpzGqT6sE4cx7umUyWaX2Ck8MrSEmPAR31sNWGz"
        );
      });
    };

    it("should display editions in amount input", () => {
      render(fixture(MOCK_PKH, { type: "token", data: mockNFT(1) }));
      expect(screen.getByTestId(/currency/)).toHaveTextContent("editions");
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
      const contractAddress = nft.token?.contract?.address as string;
      expect(fakeTezosUtils.submitBatch).toHaveBeenCalledWith(
        [
          {
            type: "fa2",
            amount: "1",
            recipient: parseImplicitPkh("tz1Kt4P8BCaP93AEV4eA7gmpRryWt5hznjCP"),
            sender: parseImplicitPkh("tz1UZFB9kGauB6F5c2gfJo4hVcvrD8MeJ3Vf"),
            contract: parseContractPkh(contractAddress),
            tokenId: nft.token?.tokenId,
          },
        ],
        config
      );
    });
  });

  describe("case delegations", () => {
    beforeEach(() => {
      const { updateBakers } = assetsSlice.actions;
      store.dispatch(updateBakers([mockBaker(1), mockBaker(2), mockBaker(3)]));
    });

    test("it displays delegation form form", async () => {
      render(fixture(MOCK_PKH, { type: "delegation" }));

      expect(screen.getByText(/delegate/i)).toBeTruthy();

      const bakerInput = screen.getByTestId("real-address-input-baker");
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
    //   // userEvent.selectOptions(senderInput, mockAccount(1).pkh);
    // });
  });
  describe("case send tez with Google account", () => {
    const fillForm = async () => {
      render(fixture(mockImplicitAccount(4, AccountType.SOCIAL).address.pkh, { type: "tez" }));

      const amountInput = screen.getByLabelText(/amount/i);
      fireEvent.change(amountInput, { target: { value: 23 } });

      const recipientInput = screen.getByLabelText(/to/i);
      fireEvent.change(recipientInput, { target: { value: mockImplicitAddress(7).pkh } });

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
      render(fixture(mockImplicitAccount(5, AccountType.LEDGER).address.pkh, { type: "tez" }));

      const amountInput = screen.getByLabelText(/amount/i);
      fireEvent.change(amountInput, { target: { value: 23 } });

      const recipientInput = screen.getByLabelText(/to/i);
      fireEvent.change(recipientInput, { target: { value: mockImplicitAddress(7).pkh } });

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

  describe("Multisig", () => {
    it("hides the signer input if only one available", async () => {
      render(fixture(multisigs[0].address.pkh, { type: "tez" }));
      expect(screen.queryByTestId("real-address-input-proposalSigner")).not.toBeInTheDocument();
    });

    it("shows the signer input if more than one available", async () => {
      render(fixture(multisigs[1].address.pkh, { type: "tez" }));
      expect(screen.getByTestId("real-address-input-proposalSigner")).toHaveAttribute(
        "value",
        mockImplicitAddress(1).pkh
      );
    });

    test("User can acomplish a tez proposal", async () => {
      fakeTezosUtils.estimateMultisigPropose.mockResolvedValueOnce({
        suggestedFeeMutez: 12345,
      } as Estimate);
      fakeTezosUtils.proposeMultisigLambda.mockResolvedValueOnce({
        hash: "mockHash",
      } as TransactionOperation);

      render(fixture(MOCK_PKH, { type: "tez" }));
      selectSender("Multisig Account 1");

      const amountInput = screen.getByLabelText(/amount/i);
      fireEvent.change(amountInput, { target: { value: 23 } });

      const recipientInput = screen.getByLabelText(/to/i);
      fireEvent.change(recipientInput, { target: { value: mockImplicitAddress(7).pkh } });

      const submitBtn = screen.getByText(/preview/i);

      await waitFor(() => {
        expect(submitBtn).toBeEnabled();
      });

      fireEvent.click(submitBtn);

      await waitFor(() => {
        const subTotal = screen.getByLabelText(/^sub-total$/i);
        expect(subTotal).toHaveTextContent(/23 ꜩ/i);

        const fee = screen.getByLabelText(/^fee$/i);
        expect(fee).toHaveTextContent(/0.012345 ꜩ/i);

        const total = screen.getByLabelText(/^total$/i);
        expect(total).toHaveTextContent(/23.012345 ꜩ/i);
      });

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
          "https://mainnet.tzkt.io/mockHash"
        );
      });
    });

    test("User can acomplish an FA2 proposal", async () => {
      fakeTezosUtils.estimateMultisigPropose.mockResolvedValueOnce({
        suggestedFeeMutez: 12345,
      } as Estimate);
      fakeTezosUtils.proposeMultisigLambda.mockResolvedValueOnce({
        hash: "mockHash",
      } as TransactionOperation);
      const multisigPkh = multisigs[1].address.pkh;
      render(fixture(multisigPkh, { type: "token", data: mockNFT(1) }));

      const recipientInput = screen.getByLabelText(/to/i);
      fireEvent.change(recipientInput, { target: { value: mockImplicitAddress(7).pkh } });

      const submitBtn = screen.getByText(/preview/i);

      await waitFor(() => {
        expect(submitBtn).toBeEnabled();
      });

      fireEvent.click(submitBtn);

      await waitFor(() => {
        const fee = screen.getByLabelText(/^fee$/i);
        expect(fee).toHaveTextContent(/0.012345 ꜩ/i);

        const total = screen.getByLabelText(/^total$/i);
        expect(total).toHaveTextContent(/0.012345 ꜩ/i);
      });

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
          "https://mainnet.tzkt.io/mockHash"
        );
      });
    });

    test("User can acomplish an FA1 proposal", async () => {
      const MOCK_TOKEN_SYMBOL = "FA1FOO";

      const mockFa1: FA12TokenBalance = {
        type: "fa1.2",
        contract: mockContractAddress(2).pkh,
        tokenId: "0",
        balance: "3",
        metadata: {
          symbol: MOCK_TOKEN_SYMBOL,
          decimals: "8",
        },
      };
      fakeTezosUtils.estimateMultisigPropose.mockResolvedValueOnce({
        suggestedFeeMutez: 12345,
      } as Estimate);
      fakeTezosUtils.proposeMultisigLambda.mockResolvedValueOnce({
        hash: "mockHash",
      } as TransactionOperation);
      render(
        fixture(MOCK_PKH, {
          type: "token",
          data: mockFa1,
        })
      );

      selectSender("Multisig Account 1");

      const recipientInput = screen.getByLabelText(/to/i);
      fireEvent.change(recipientInput, { target: { value: mockImplicitAddress(7).pkh } });

      const amountInput = screen.getByLabelText(/amount/i);
      fireEvent.change(amountInput, { target: { value: 10 } });
      const submitBtn = screen.getByText(/preview/i);

      await waitFor(() => {
        expect(submitBtn).toBeEnabled();
      });

      fireEvent.click(submitBtn);

      await waitFor(() => {
        const fee = screen.getByLabelText(/^fee$/i);
        expect(fee).toHaveTextContent(/0.012345 ꜩ/i);

        const total = screen.getByLabelText(/^total$/i);
        expect(total).toHaveTextContent(/0.012345 ꜩ/i);
      });

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
          "https://mainnet.tzkt.io/mockHash"
        );
      });
    });
  });
});
