import { Modal } from "@chakra-ui/react";
import BigNumber from "bignumber.js";

import { FormValues } from "./FormValues";
import { SelectApproversFormPage } from "./SelectApproversFormPage";
import { SignTransactionFormPage } from "./SignTransactionFormPage";
import {
  mockContractAddress,
  mockContractOrigination,
  mockImplicitAccount,
  mockImplicitAddress,
  mockMnemonicAccount,
} from "../../../mocks/factories";
import { addAccount } from "../../../mocks/helpers";
import {
  act,
  dynamicModalContextMock,
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
} from "../../../mocks/testUtils";
import { contract, makeStorageJSON } from "../../../multisig/contract";
import { makeAccountOperations } from "../../../types/AccountOperations";
import { estimate } from "../../../utils/tezos";

const MULTISIG_NAME = "Multisig Account Name";
const SENDER = mockMnemonicAccount(0);
const goBackSpy = jest.fn();

const fixture = (formValues?: FormValues) => {
  const values = {
    name: MULTISIG_NAME,
    ...formValues,
  };
  return (
    <Modal isOpen={true} onClose={() => {}}>
      <SelectApproversFormPage form={values as any} goBack={goBackSpy} sender={SENDER} />
    </Modal>
  );
};

jest.mock("../../../utils/tezos/estimate");

beforeEach(() =>
  [mockMnemonicAccount(0), mockMnemonicAccount(1), mockMnemonicAccount(2)].forEach(addAccount)
);

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
    it("calls the goBack function on click", async () => {
      const user = userEvent.setup();
      render(fixture());

      await act(() => user.click(screen.getByTestId("back-button")));
      expect(goBackSpy).toHaveBeenCalled();
    });
  });

  describe("approvers", () => {
    describe("add button", () => {
      it("adds a new approver field", async () => {
        const user = userEvent.setup();
        render(fixture());

        const addSignerButton = screen.getByRole("button", { name: "+ Add Approver" });
        await act(() => user.click(addSignerButton));

        expect(screen.getAllByTestId(/^address-autocomplete-signer/)).toHaveLength(2);
        expect(screen.getAllByTestId(/^address-autocomplete-signer/)).toHaveLength(2);

        await act(() => user.click(addSignerButton));

        expect(screen.getAllByTestId(/^address-autocomplete-signer/)).toHaveLength(3);
      });
    });

    describe("remove button", () => {
      it("is hidden when there is only one approver", () => {
        render(fixture());

        expect(screen.queryByTestId(/remove-signer-/)).not.toBeInTheDocument();
      });

      it("appears when you have 2+ approvers", async () => {
        const user = userEvent.setup();
        render(fixture());

        const addSignerButton = screen.getByRole("button", { name: "+ Add Approver" });

        await act(() => user.click(addSignerButton));

        expect(screen.getAllByTestId(/remove-signer-/)).toHaveLength(2);
      });

      it("removes the correct approver", async () => {
        const user = userEvent.setup();
        render(fixture());
        const addSignerButton = screen.getByRole("button", { name: "+ Add Approver" });

        await act(() => user.click(addSignerButton));
        await act(() => user.click(addSignerButton));

        expect(screen.getAllByTestId(/^address-autocomplete-signers/)).toHaveLength(3);

        await act(() =>
          user.type(
            screen.getByLabelText("Select 1st approver"),
            mockImplicitAccount(0).address.pkh
          )
        );
        await act(() =>
          user.type(screen.getByLabelText("2nd approver"), mockImplicitAddress(1).pkh)
        );
        await act(() =>
          user.type(screen.getByLabelText("3rd approver"), mockImplicitAddress(2).pkh)
        );

        expect(screen.getAllByTestId(/remove-signer-/)).toHaveLength(3);

        await act(() => user.click(screen.getByTestId("remove-signer-1")));

        expect(screen.getAllByTestId(/^address-autocomplete-signers/)).toHaveLength(2);
        expect(screen.getByTestId("real-address-input-signers.0.val")).toHaveValue(
          mockImplicitAccount(0).address.pkh
        );
        expect(screen.getByTestId("real-address-input-signers.1.val")).toHaveValue(
          mockImplicitAddress(2).pkh
        );
      });
    });

    it("doesn't allow non-tz addresses", async () => {
      const user = userEvent.setup();
      render(fixture());

      await act(() =>
        user.type(screen.getByLabelText("Select 1st approver"), mockContractAddress(0).pkh)
      );

      expect(screen.getByTestId("signer-0-error")).toHaveTextContent(
        "Signer must be valid TZ address"
      );
    });

    it("doesn't allow duplications", async () => {
      const user = userEvent.setup();
      render(fixture());

      const addSignerButton = screen.getByRole("button", { name: "+ Add Approver" });
      await act(() => user.click(addSignerButton));
      await act(() =>
        user.type(screen.getByLabelText("Select 1st approver"), mockImplicitAddress(1).pkh)
      );
      await act(() => user.type(screen.getByLabelText("2nd approver"), mockImplicitAddress(1).pkh));

      expect(screen.getByTestId("signer-1-error")).toHaveTextContent("Duplicate approver");
      expect(screen.getByTestId("signer-1-error")).toHaveTextContent("Duplicate approver");
      expect(screen.getByTestId("signer-1-error")).toHaveTextContent("Duplicate approver");
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
      const user = userEvent.setup();
      render(fixture());

      expect(screen.getByTestId("max-signers")).toHaveTextContent("out of 1");

      const addSignerButton = screen.getByRole("button", { name: "+ Add Approver" });
      await act(() => user.click(addSignerButton));

      expect(screen.getByTestId("max-signers")).toHaveTextContent("out of 2");
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
      const user = userEvent.setup();
      const sender = mockImplicitAccount(1);
      render(
        fixture({
          name: "Test account",
          sender: sender.address.pkh,
          signers: [
            { val: mockImplicitAccount(0).address.pkh },
            { val: mockImplicitAccount(1).address.pkh },
          ],
          threshold: 1,
        })
      );

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
      jest.mocked(estimate).mockResolvedValueOnce(BigNumber(150));

      const reviewButton = screen.getByText("Review");
      await waitFor(() => expect(reviewButton).toBeEnabled());
      await act(() => user.click(reviewButton));

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

  describe("empty form", () => {
    it("builds operation that can be submitted from the next step", async () => {
      render(fixture());

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
      jest.mocked(estimate).mockResolvedValueOnce(BigNumber(100));
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
