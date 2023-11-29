import { Modal } from "@chakra-ui/react";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import {
  mockContractAddress,
  mockImplicitAccount,
  mockImplicitAddress,
  mockMnemonicAccount,
} from "../../../mocks/factories";
import { FormPage, FormValues } from "./FormPage";
import store from "../../../utils/redux/store";
import { multisigs } from "../../../mocks/multisig";
import { render } from "../../../mocks/testUtils";
import { multisigActions } from "../../../utils/redux/slices/multisigsSlice";
import accountsSlice from "../../../utils/redux/slices/accountsSlice";
import { makeAccountOperations } from "../../../types/AccountOperations";
import { contract, makeStorageJSON } from "../../../multisig/multisigContract";
import BigNumber from "bignumber.js";
import { DynamicModalContext } from "../../DynamicModal";
import { dynamicModalContextMock } from "../../../mocks/dynamicModal";
import SignPage from "./SignPage";
import { mockEstimatedFee } from "../../../mocks/helpers";

const fixture = (formValues?: FormValues) => {
  return (
    <Modal isOpen={true} onClose={() => {}}>
      <FormPage form={formValues} />
    </Modal>
  );
};

beforeEach(() => {
  store.dispatch(accountsSlice.actions.addMockMnemonicAccounts([mockMnemonicAccount(0)]));
});

describe("FormPage", () => {
  describe("name", () => {
    it("is empty by default", () => {
      render(fixture());
      expect(screen.getByLabelText("Name the Contract")).toHaveValue("");
    });

    it("is required", async () => {
      render(fixture());

      fireEvent.blur(screen.getByLabelText("Name the Contract"));
      await waitFor(() => {
        expect(screen.getByTestId("name-error")).toHaveTextContent("Name is required");
      });
    });
  });

  describe("owner", () => {
    it("doesn't allow custom addresses", async () => {
      render(fixture());
      const ownerInput = screen.getByLabelText("Select Owner");
      fireEvent.change(ownerInput, { target: { value: mockImplicitAccount(1).address.pkh } });
      await waitFor(() => {
        expect(screen.getByTestId("owner-error")).toHaveTextContent("Invalid address or contact");
      });
    });

    it("doesn't allow non-implicit addresses", async () => {
      store.dispatch(multisigActions.setMultisigs(multisigs));
      render(fixture());
      const ownerInput = screen.getByLabelText("Select Owner");
      fireEvent.change(ownerInput, { target: { value: multisigs[0].address.pkh } });
      await waitFor(() => {
        expect(screen.getByTestId("owner-error")).toHaveTextContent("Invalid address or contact");
      });
    });
  });

  describe("signers", () => {
    describe("add button", () => {
      it("adds a new signer field", async () => {
        render(fixture());
        const addSignerButton = screen.getByRole("button", { name: "+ Add Signer" });

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
      it("is hidden when there is only one signer", () => {
        render(fixture());
        expect(screen.queryByTestId(/remove-signer-/)).not.toBeInTheDocument();
      });

      it("appears when you have 2+ signers", async () => {
        render(fixture());
        const addSignerButton = screen.getByRole("button", { name: "+ Add Signer" });

        fireEvent.click(addSignerButton);
        await waitFor(() => {
          expect(screen.getAllByTestId(/remove-signer-/)).toHaveLength(2);
        });
      });

      it("removes the correct signer", async () => {
        render(fixture());
        const addSignerButton = screen.getByRole("button", { name: "+ Add Signer" });

        fireEvent.click(addSignerButton);
        fireEvent.click(addSignerButton);
        await waitFor(() => {
          expect(screen.getAllByTestId(/^address-autocomplete-signers/)).toHaveLength(3);
        });
        fireEvent.change(screen.getByLabelText("Select 1 signer"), {
          target: { value: mockImplicitAccount(0).address.pkh },
        });
        fireEvent.change(screen.getByLabelText("2 signer"), {
          target: { value: mockImplicitAddress(1).pkh },
        });
        fireEvent.change(screen.getByLabelText("3 signer"), {
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
      fireEvent.change(screen.getByLabelText("Select 1 signer"), {
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
      const addSignerButton = screen.getByRole("button", { name: "+ Add Signer" });

      fireEvent.click(addSignerButton);

      fireEvent.change(screen.getByLabelText("Select 1 signer"), {
        target: { value: mockImplicitAddress(1).pkh },
      });
      fireEvent.change(screen.getByLabelText("2 signer"), {
        target: { value: mockImplicitAddress(1).pkh },
      });

      await waitFor(() => {
        expect(screen.getByTestId("signer-1-error")).toHaveTextContent("Duplicate signer");
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

    it("doesn't allow values above the number of signers", async () => {
      render(fixture());
      fireEvent.change(screen.getByTestId("threshold-input"), { target: { value: "2" } });
      fireEvent.blur(screen.getByTestId("threshold-input"));
      await waitFor(() => {
        expect(screen.getByTestId("threshold-error")).toHaveTextContent(
          "Max no. of approvals is 1"
        );
      });

      const addSignerButton = screen.getByRole("button", { name: "+ Add Signer" });
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

      const addSignerButton = screen.getByRole("button", { name: "+ Add Signer" });
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
          sender: mockImplicitAccount(0).address.pkh,
          signers: [
            { val: mockImplicitAccount(0).address.pkh },
            { val: mockImplicitAccount(1).address.pkh },
          ],
          threshold: 1,
        })
      );
      await waitFor(() => {
        expect(screen.getByText("Review")).toBeEnabled();
      });
      expect(screen.getByTestId("real-address-input-sender")).toHaveValue(
        mockImplicitAccount(0).address.pkh
      );
      expect(screen.getByTestId("real-address-input-signers.0.val")).toHaveValue(
        mockImplicitAccount(0).address.pkh
      );
      expect(screen.getByTestId("real-address-input-signers.1.val")).toHaveValue(
        mockImplicitAccount(1).address.pkh
      );
      expect(screen.getByTestId("threshold-input")).toHaveValue(1);
    });
  });

  test("submit", async () => {
    render(
      <DynamicModalContext.Provider value={dynamicModalContextMock}>
        {fixture()}
      </DynamicModalContext.Provider>
    );

    fireEvent.change(screen.getByLabelText("Name the Contract"), {
      target: { value: "some name" },
    });
    fireEvent.change(screen.getByLabelText("Select Owner"), {
      target: { value: mockImplicitAccount(0).address.pkh },
    });
    fireEvent.change(screen.getByLabelText("Select 1 signer"), {
      target: { value: mockImplicitAddress(1).pkh },
    });
    fireEvent.change(screen.getByTestId("threshold-input"), { target: { value: "1" } });
    const submitButton = screen.getByText("Review");
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
    fireEvent.click(submitButton);

    const operations = makeAccountOperations(mockImplicitAccount(0), mockImplicitAccount(0), [
      {
        type: "contract_origination",
        sender: mockImplicitAccount(0).address,
        code: contract,
        storage: makeStorageJSON(
          mockImplicitAccount(0).address.pkh,
          [mockImplicitAddress(1).pkh],
          "1"
        ),
      },
    ]);
    mockEstimatedFee(100);
    await waitFor(() => {
      expect(dynamicModalContextMock.openWith).toHaveBeenCalledWith(
        <SignPage
          data={{
            sender: mockImplicitAccount(0).address.pkh,
            threshold: 1,
            signers: [{ val: mockImplicitAddress(1).pkh }],
            name: "some name",
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
