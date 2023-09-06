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
  mockEstimatedFee,
} from "../../mocks/helpers";
import { fireEvent, render, screen, waitFor, within } from "../../mocks/testUtils";
import { AccountType, MnemonicAccount } from "../../types/Account";
import {
  FA12TokenBalance,
  FA2TokenBalance,
  fromRaw,
  TokenBalanceWithToken,
} from "../../types/TokenBalance";
import * as accountUtils from "../../utils/hooks/accountUtils";
import assetsSlice from "../../utils/redux/slices/assetsSlice";
import store from "../../utils/redux/store";
import { SendForm } from "./SendForm";
import { SendFormMode, makeAccountOperations } from "./types";

import { TezosToolkit } from "@taquito/taquito";
import { multisigActions } from "../../utils/redux/slices/multisigsSlice";
import { multisigs } from "../../mocks/multisig";
import { parseContractPkh, parsePkh } from "../../types/Address";
import tokensSlice from "../../utils/redux/slices/tokensSlice";
import { fa1Token, fa2Token, nft } from "../../mocks/tzktResponse";
import { estimate, executeOperations, makeToolkit } from "../../utils/tezos";
import { MAINNET } from "../../types/Network";

// These tests might take long in the CI
jest.setTimeout(10000);

jest.mock("../../GoogleAuth", () => ({
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  GoogleAuth: require("../../mocks/GoogleAuthMock").GoogleAuthMock,
}));
jest.mock("../../utils/hooks/accountUtils");

const fakeAccountUtils = jest.mocked(accountUtils);

const fixture = (sender: string, mode: SendFormMode) => (
  <Modal isOpen={true} onClose={() => {}}>
    <SendForm sender={sender} mode={mode} />
  </Modal>
);

const MOCK_SK = "mockSk";
const MOCK_PKH = mockImplicitAccount(1).address.pkh;
const MOCK_TEZOS_TOOLKIT = {} as TezosToolkit;

beforeEach(async () => {
  fakeAccountUtils.useGetSecretKey.mockReturnValue(() => Promise.resolve(MOCK_SK));
  jest.mocked(makeToolkit).mockResolvedValue(MOCK_TEZOS_TOOLKIT);
  document.getElementById("chakra-toast-portal")?.remove();
  store.dispatch(
    tokensSlice.actions.addTokens({
      network: MAINNET,
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

      mockEstimatedFee(MOCK_FEE);
      fireEvent.click(estimateButton);

      await waitFor(() => {
        const fee = screen.getByLabelText(/^fee$/i);
        expect(fee).toHaveTextContent(`${MOCK_FEE} ꜩ`);
      });

      expect(jest.mocked(estimate)).toHaveBeenCalledWith(
        {
          type: "implicit",
          operations: [
            {
              type: "fa2",
              amount: "1000000",
              recipient: parsePkh("tz1Kt4P8BCaP93AEV4eA7gmpRryWt5hznjCP"),
              sender: parsePkh("tz1ikfEcj3LmsmxpcC1RMZNzBHbEmybCc43D"),
              contract: parseContractPkh(mockFA2.contract),
              tokenId: mockFA2.tokenId,
            },
          ],
          sender: mockImplicitAccount(2),
          signer: mockImplicitAccount(2),
        },
        MAINNET
      );

      fillPassword("mockPass");

      jest.mocked(executeOperations).mockResolvedValueOnce({
        opHash: "mockHash",
      });

      const submit = screen.getByRole("button", {
        name: /submit transaction/i,
      });

      await waitFor(() => {
        expect(submit).toBeEnabled();
      });

      submit.click();

      await waitFor(() => {
        expect(screen.getByText(/Operation Submitted/i)).toBeInTheDocument();
        expect(screen.getByTestId(/tzkt-link/i)).toHaveProperty("href", "https://tzkt.io/mockHash");
      });

      expect(jest.mocked(executeOperations)).toHaveBeenCalledWith(
        makeAccountOperations(mockImplicitAccount(2), mockImplicitAccount(2), [
          {
            amount: "1000000",
            contract: { pkh: "KT1EctCuorV2NfVb1XTQgvzJ88MQtWP8cMMv", type: "contract" },
            recipient: { pkh: "tz1Kt4P8BCaP93AEV4eA7gmpRryWt5hznjCP", type: "implicit" },
            sender: { pkh: "tz1ikfEcj3LmsmxpcC1RMZNzBHbEmybCc43D", type: "implicit" },
            tokenId: "7",
            type: "fa2",
          },
        ]),
        MOCK_TEZOS_TOOLKIT
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

      mockEstimatedFee(MOCK_FEE);

      fireEvent.click(estimateButton);

      await waitFor(() => {
        const fee = screen.getByLabelText(/^fee$/i);
        expect(fee).toHaveTextContent(`${MOCK_FEE} ꜩ`);
      });

      expect(jest.mocked(estimate)).toHaveBeenCalledWith(
        {
          type: "implicit",
          operations: [
            {
              type: "fa1.2",
              amount: "1000000000",
              recipient: parsePkh("tz1Kt4P8BCaP93AEV4eA7gmpRryWt5hznjCP"),
              sender: parsePkh("tz1ikfEcj3LmsmxpcC1RMZNzBHbEmybCc43D"),
              contract: parseContractPkh(mockFa1.contract),
              tokenId: "0",
            },
          ],
          sender: mockImplicitAccount(2),
          signer: mockImplicitAccount(2),
        },
        MAINNET
      );

      fillPassword("mockPass");
      jest.mocked(executeOperations).mockResolvedValueOnce({
        opHash: "mockHash",
      });

      const submit = screen.getByRole("button", {
        name: /submit transaction/i,
      });

      await waitFor(() => {
        expect(submit).toBeEnabled();
      });

      submit.click();

      await waitFor(() => {
        expect(screen.getByText(/Operation Submitted/i)).toBeInTheDocument();
        expect(screen.getByTestId(/tzkt-link/i)).toHaveProperty("href", "https://tzkt.io/mockHash");
      });

      expect(jest.mocked(executeOperations)).toHaveBeenCalledWith(
        makeAccountOperations(mockImplicitAccount(2), mockImplicitAccount(2), [
          {
            amount: "1000000000",
            contract: { pkh: "KT1EctCuorV2NfVb1XTQgvzJ88MQtWP8cMMv", type: "contract" },
            recipient: { pkh: "tz1Kt4P8BCaP93AEV4eA7gmpRryWt5hznjCP", type: "implicit" },
            sender: { pkh: "tz1ikfEcj3LmsmxpcC1RMZNzBHbEmybCc43D", type: "implicit" },
            tokenId: "0",
            type: "fa1.2",
          },
        ]),
        MOCK_TEZOS_TOOLKIT
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

      mockEstimatedFee(3654);
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
      jest.mocked(executeOperations).mockResolvedValueOnce({
        opHash: "mockHash",
      });

      const submit = screen.getByRole("button", {
        name: /submit transaction/i,
      });

      await waitFor(() => {
        expect(submit).toBeEnabled();
      });
      fireEvent.click(submit);

      await waitFor(() => {
        expect(screen.getByText(/Operation Submitted/i)).toBeInTheDocument();
        expect(screen.getByTestId(/tzkt-link/i)).toHaveProperty("href", "https://tzkt.io/mockHash");
      });

      const contractAddress = nft.token.contract.address as string;
      expect(jest.mocked(executeOperations)).toHaveBeenCalledWith(
        makeAccountOperations(mockImplicitAccount(1), mockImplicitAccount(1), [
          {
            amount: "1",
            contract: { pkh: contractAddress, type: "contract" },
            recipient: { pkh: "tz1Kt4P8BCaP93AEV4eA7gmpRryWt5hznjCP", type: "implicit" },
            sender: { pkh: "tz1UZFB9kGauB6F5c2gfJo4hVcvrD8MeJ3Vf", type: "implicit" },
            tokenId: "3",
            type: "fa2",
          },
        ]),
        MOCK_TEZOS_TOOLKIT
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

      expect(screen.getByText(/delegate/i)).toBeInTheDocument();

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

  describe("Multisig", () => {
    beforeEach(() => {
      store.dispatch(multisigActions.setMultisigs(multisigs));
    });

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
      mockEstimatedFee(12345);
      jest.mocked(executeOperations).mockResolvedValueOnce({
        opHash: "mockHash",
      });

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
        expect(subTotal).toHaveTextContent(/23.000000 ꜩ/i);

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
        expect(screen.getByText(/Operation Submitted/i)).toBeInTheDocument();
        expect(screen.getByTestId(/tzkt-link/i)).toHaveProperty("href", "https://tzkt.io/mockHash");
      });
    });

    test("User can acomplish an FA2 proposal", async () => {
      mockEstimatedFee(12345);

      jest.mocked(executeOperations).mockResolvedValueOnce({
        opHash: "mockHash",
      });
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
        expect(screen.getByText(/Operation Submitted/i)).toBeInTheDocument();
        expect(screen.getByTestId(/tzkt-link/i)).toHaveProperty("href", "https://tzkt.io/mockHash");
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
      mockEstimatedFee(12345);
      jest.mocked(executeOperations).mockResolvedValueOnce({
        opHash: "mockHash",
      });

      render(
        fixture(multisigs[0].address.pkh, {
          type: "token",
          data: mockFa1,
        })
      );

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
        expect(screen.getByText(/Operation Submitted/i)).toBeInTheDocument();
        expect(screen.getByTestId(/tzkt-link/i)).toHaveProperty("href", "https://tzkt.io/mockHash");
      });
    });
  });
});
