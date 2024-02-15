import { Modal } from "@chakra-ui/react";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import BigNumber from "bignumber.js";

import { NameMultisigFormPage } from "./NameMultisigFormPage";
import { FormValues, SelectApproversFormPage } from "./SelectApproversFormPage";
import { SignTransactionFormPage } from "./SignTransactionFormPage";
import { dynamicModalContextMock } from "../../../mocks/dynamicModal";
import {
  mockContractAddress,
  mockContractOrigination,
  mockImplicitAccount,
  mockImplicitAddress,
  mockMnemonicAccount,
} from "../../../mocks/factories";
import { mockEstimatedFee } from "../../../mocks/helpers";
import { render } from "../../../mocks/testUtils";
import { contract, makeStorageJSON } from "../../../multisig/multisigContract";
import { makeAccountOperations } from "../../../types/AccountOperations";
import { accountsSlice } from "../../../utils/redux/slices/accountsSlice";
import { store } from "../../../utils/redux/store";
import { DynamicModalContext } from "../../DynamicModal";

const MULTISIG_NAME = "Multisig Account Name";
const SENDER = mockMnemonicAccount(0);

const fixture = (formValues?: FormValues) => {
  const values = {
    name: MULTISIG_NAME,
    ...formValues,
  };
  return (
    <Modal isOpen={true} onClose={() => {}}>
      <SelectApproversFormPage form={values as any} sender={SENDER} />
    </Modal>
  );
};

beforeEach(() => {
  store.dispatch(
    accountsSlice.actions.addMockMnemonicAccounts([
      mockMnemonicAccount(0),
      mockMnemonicAccount(1),
      mockMnemonicAccount(2),
    ])
  );
});

describe("SelectApproversFormPage", () => {
  it("has a title", () => {
    render(fixture());

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Select Approvers");
  });

  it("has a subtitle", () => {
    render(fixture());

    expect(
      screen.getByText(
        "Select the participants of the contract and choose the minimum number of approvals."
      )
    ).toBeInTheDocument();
  });

  describe("back button", () => {
    it("is visible", () => {
      render(fixture());

      expect(screen.getByTestId("back-button")).toBeInTheDocument();
    });

    it("opens NameMultisigFormPage on click", async () => {
      render(
        <DynamicModalContext.Provider value={dynamicModalContextMock}>
          {fixture()}
        </DynamicModalContext.Provider>
      );

      fireEvent.click(screen.getByTestId("back-button"));

      await waitFor(() => {
        expect(dynamicModalContextMock.openWith).toHaveBeenCalledWith(
          <NameMultisigFormPage name={MULTISIG_NAME} />
        );
      });
    });
  });

  describe("approvers", () => {
    describe("add button", () => {
      it("adds a new approver field", async () => {
        render(fixture());
        const addSignerButton = screen.getByRole("button", { name: "+ Add Approver" });

        fireEvent.click(addSignerButton);
        await waitFor(() => {
          expect(screen.getAllByTestId(/^address-autocomplete-signer/)).toHaveLength(2);
        });

        fireEvent.click(addSignerButton);
        await waitFor(() => {
          expect(screen.getAllByTestId(/^address-autocomplete-signer/)).toHaveLength(3);
        });
      });
    });

    describe("remove button", () => {
      it("is hidden when there is only one approver", () => {
        render(fixture());
        expect(screen.queryByTestId(/remove-signer-/)).not.toBeInTheDocument();
      });

      it("appears when you have 2+ approvers", async () => {
        render(fixture());
        const addSignerButton = screen.getByRole("button", { name: "+ Add Approver" });

        fireEvent.click(addSignerButton);
        await waitFor(() => {
          expect(screen.getAllByTestId(/remove-signer-/)).toHaveLength(2);
        });
      });

      it("removes the correct approver", async () => {
        render(fixture());
        const addSignerButton = screen.getByRole("button", { name: "+ Add Approver" });

        fireEvent.click(addSignerButton);
        fireEvent.click(addSignerButton);
        await waitFor(() => {
          expect(screen.getAllByTestId(/^address-autocomplete-signers/)).toHaveLength(3);
        });
        fireEvent.change(screen.getByLabelText("Select 1st approver"), {
          target: { value: mockImplicitAccount(0).address.pkh },
        });
        fireEvent.change(screen.getByLabelText("2nd approver"), {
          target: { value: mockImplicitAddress(1).pkh },
        });
        fireEvent.change(screen.getByLabelText("3rd approver"), {
          target: { value: mockImplicitAddress(2).pkh },
        });
        await waitFor(() => {
          expect(screen.getAllByTestId(/remove-signer-/)).toHaveLength(3);
        });
        fireEvent.click(screen.getByTestId("remove-signer-1"));
        await waitFor(() => {
          expect(screen.getAllByTestId(/^address-autocomplete-signers/)).toHaveLength(2);
        });

        expect(screen.getByTestId("real-address-input-signers.0.val")).toHaveValue(
          mockImplicitAccount(0).address.pkh
        );
        expect(screen.getByTestId("real-address-input-signers.1.val")).toHaveValue(
          mockImplicitAddress(2).pkh
        );
      });
    });

    it("doesn't allow non-tz addresses", async () => {
      render(fixture());
      fireEvent.change(screen.getByLabelText("Select 1st approver"), {
        target: { value: mockContractAddress(0).pkh },
      });
      await waitFor(() => {
        expect(screen.getByTestId("signer-0-error")).toHaveTextContent(
          "Signer must be valid TZ address"
        );
      });
    });

    it("doesn't allow duplications", async () => {
      render(fixture());

      const addSignerButton = screen.getByRole("button", { name: "+ Add Approver" });
      fireEvent.click(addSignerButton);

      fireEvent.change(screen.getByLabelText("Select 1st approver"), {
        target: { value: mockImplicitAddress(1).pkh },
      });
      fireEvent.change(screen.getByLabelText("2nd approver"), {
        target: { value: mockImplicitAddress(1).pkh },
      });

      await waitFor(() => {
        expect(screen.getByTestId("signer-1-error")).toHaveTextContent("Duplicate approver");
      });
    });
  });

  describe("threshold", () => {
    it("doesn't allow values < 1", async () => {
      render(fixture());

      fireEvent.change(screen.getByTestId("threshold-input"), { target: { value: "0" } });
      fireEvent.blur(screen.getByTestId("threshold-input"));

      await waitFor(() => {
        expect(screen.getByTestId("threshold-error")).toHaveTextContent(
          "Min no. of approvals is 1"
        );
      });
    });

    it("doesn't allow values above the number of approvers", async () => {
      render(fixture());

      fireEvent.change(screen.getByTestId("threshold-input"), { target: { value: "2" } });
      fireEvent.blur(screen.getByTestId("threshold-input"));
      await waitFor(() => {
        expect(screen.getByTestId("threshold-error")).toHaveTextContent(
          "Max no. of approvals is 1"
        );
      });

      const addSignerButton = screen.getByRole("button", { name: "+ Add Approver" });
      fireEvent.click(addSignerButton);
      fireEvent.change(screen.getByTestId("threshold-input"), { target: { value: "3" } });
      fireEvent.blur(screen.getByTestId("threshold-input"));

      await waitFor(() => {
        expect(screen.getByTestId("threshold-error")).toHaveTextContent(
          "Max no. of approvals is 2"
        );
      });
    });

    it("shows the correct max threshold", async () => {
      render(fixture());

      expect(screen.getByTestId("max-signers")).toHaveTextContent("out of 1");

      const addSignerButton = screen.getByRole("button", { name: "+ Add Approver" });
      fireEvent.click(addSignerButton);

      await waitFor(() => {
        expect(screen.getByTestId("max-signers")).toHaveTextContent("out of 2");
      });
    });
  });

  describe("prefilled form", () => {
    it("can be rendered with preselected values", async () => {
      render(
        fixture({
          name: "Test account",
          sender: mockImplicitAccount(1).address.pkh,
          signers: [
            { val: mockImplicitAccount(0).address.pkh },
            { val: mockImplicitAccount(1).address.pkh },
          ],
          threshold: 2,
        })
      );

      expect(screen.getByTestId("real-address-input-signers.0.val")).toHaveValue(
        mockImplicitAccount(0).address.pkh
      );
      expect(screen.getByTestId("real-address-input-signers.1.val")).toHaveValue(
        mockImplicitAccount(1).address.pkh
      );
      expect(screen.getByTestId("threshold-input")).toHaveValue(2);

      await waitFor(() => {
        expect(screen.getByText("Review")).toBeEnabled();
      });
    });

    it("builds operation that can be submitted from the next step", async () => {
      const sender = mockImplicitAccount(1);
      render(
        <DynamicModalContext.Provider value={dynamicModalContextMock}>
          {fixture({
            name: "Test account",
            sender: sender.address.pkh,
            signers: [
              { val: mockImplicitAccount(0).address.pkh },
              { val: mockImplicitAccount(1).address.pkh },
            ],
            threshold: 1,
          })}
        </DynamicModalContext.Provider>
      );

      const reviewButton = screen.getByText("Review");
      await waitFor(() => {
        expect(reviewButton).toBeEnabled();
      });
      fireEvent.click(reviewButton);

      const operations = makeAccountOperations(sender, sender, [
        mockContractOrigination(
          1, // sender id
          makeStorageJSON(
            sender.address.pkh,
            [mockImplicitAccount(0).address.pkh, mockImplicitAddress(1).pkh],
            "1"
          ),
          contract
        ),
      ]);
      mockEstimatedFee(150);
      await waitFor(() => {
        expect(dynamicModalContextMock.openWith).toHaveBeenCalledWith(
          <SignTransactionFormPage
            data={{
              sender: sender.address.pkh,
              threshold: 1,
              signers: [{ val: mockImplicitAddress(0).pkh }, { val: mockImplicitAddress(1).pkh }],
              name: "Test account",
            }}
            fee={new BigNumber(150)}
            goBack={expect.any(Function)}
            mode="single"
            operations={operations}
          />
        );
      });
    });
  });

  describe("empty form", () => {
    it("builds operation that can be submitted from the next step", async () => {
      render(
        <DynamicModalContext.Provider value={dynamicModalContextMock}>
          {fixture()}
        </DynamicModalContext.Provider>
      );

      // select values
      const addSignerButton = screen.getByRole("button", { name: "+ Add Approver" });
      fireEvent.click(addSignerButton);
      await waitFor(() => {
        expect(screen.getAllByTestId(/^address-autocomplete-signer/)).toHaveLength(2);
      });
      fireEvent.change(screen.getByLabelText("Select 1st approver"), {
        target: { value: mockImplicitAddress(1).pkh },
      });
      fireEvent.change(screen.getByLabelText("2nd approver"), {
        target: { value: mockImplicitAddress(2).pkh },
      });
      fireEvent.change(screen.getByTestId("threshold-input"), { target: { value: "2" } });

      // open sign form
      const reviewButton = screen.getByText("Review");
      await waitFor(() => {
        expect(reviewButton).toBeEnabled();
      });
      fireEvent.click(reviewButton);

      const operations = makeAccountOperations(SENDER, SENDER, [
        mockContractOrigination(
          0, // sender id
          makeStorageJSON(
            SENDER.address.pkh,
            [mockImplicitAccount(1).address.pkh, mockImplicitAddress(2).pkh],
            "2"
          ),
          contract
        ),
      ]);
      mockEstimatedFee(100);
      await waitFor(() => {
        expect(dynamicModalContextMock.openWith).toHaveBeenCalledWith(
          <SignTransactionFormPage
            data={{
              sender: SENDER.address.pkh,
              threshold: 2,
              signers: [{ val: mockImplicitAddress(1).pkh }, { val: mockImplicitAddress(2).pkh }],
              name: MULTISIG_NAME,
            }}
            fee={new BigNumber(100)}
            goBack={expect.any(Function)}
            mode="single"
            operations={operations}
          />
        );
      });
    });
  });
});
