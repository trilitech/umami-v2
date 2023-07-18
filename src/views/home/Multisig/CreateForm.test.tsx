import { Modal } from "@chakra-ui/react";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import {
  mockContractAddress,
  mockImplicitAccount,
  mockImplicitAddress,
} from "../../../mocks/factories";
import { CreateForm } from "./CreateForm";
import { ReviewStep } from "./useCreateMultisigModal";
import { store } from "../../../utils/store/store";
import accountsSlice from "../../../utils/store/accountsSlice";
import { multisigActions } from "../../../utils/store/multisigsSlice";
import { multisigs } from "../../../mocks/multisig";
import { render } from "../../../mocks/testUtils";

const fixture = ({ goToStep = _ => {} }: { goToStep?: (step: ReviewStep) => void }) => {
  return (
    <Modal isOpen onClose={() => {}}>
      <CreateForm
        goToStep={goToStep}
        currentStep={{ type: "initial", defaultOwner: mockImplicitAccount(0) }}
      />
    </Modal>
  );
};

beforeEach(() => {
  store.dispatch(accountsSlice.actions.add([mockImplicitAccount(0)]));
});

describe("CreateForm", () => {
  describe("name", () => {
    it("is empty by default", () => {
      render(fixture({}));
      expect(screen.getByLabelText("Name the Contract")).toHaveValue("");
    });

    it("is required", async () => {
      render(fixture({}));

      fireEvent.blur(screen.getByLabelText("Name the Contract"));
      await waitFor(() => {
        expect(screen.getByTestId("name-error")).toHaveTextContent("Name is required");
      });
    });
  });

  describe("owner", () => {
    it("displays the default owner address", () => {
      render(fixture({}));

      expect(screen.getByLabelText("Select Owner")).toHaveValue(mockImplicitAccount(0).label);
    });

    it("doesn't allow custom addresses", async () => {
      render(fixture({}));
      const ownerInput = screen.getByLabelText("Select Owner");
      fireEvent.change(ownerInput, { target: { value: mockImplicitAccount(1).address.pkh } });
      await waitFor(() => {
        expect(screen.getByTestId("owner-error")).toHaveTextContent("Invalid address or contact");
      });
    });

    it("doesn't allow non-implicit addresses", async () => {
      store.dispatch(multisigActions.setMultisigs(multisigs));
      render(fixture({}));
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
        render(fixture({}));
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
        render(fixture({}));
        expect(screen.queryByTestId(/remove-signer-/)).not.toBeInTheDocument();
      });

      it("appears when you have 2+ signers", async () => {
        render(fixture({}));
        const addSignerButton = screen.getByRole("button", { name: "+ Add Signer" });

        fireEvent.click(addSignerButton);
        await waitFor(() => {
          expect(screen.getAllByTestId(/remove-signer-/)).toHaveLength(2);
        });
      });

      it("removes the correct signer", async () => {
        render(fixture({}));
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

        expect(screen.getByLabelText("Select 1 signer")).toHaveValue(mockImplicitAccount(0).label);
        expect(screen.getByLabelText("2 signer")).toHaveValue(mockImplicitAddress(2).pkh);
      });
    });

    it("doesn't allow non-tz addresses", async () => {
      render(fixture({}));
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
      render(fixture({}));
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
      render(fixture({}));
      fireEvent.change(screen.getByTestId("threshold-input"), { target: { value: "0" } });
      fireEvent.blur(screen.getByTestId("threshold-input"));
      await waitFor(() => {
        expect(screen.getByTestId("threshold-error")).toHaveTextContent(
          "Min no. of approvals is 1"
        );
      });
    });

    it("doesn't allow values above the number of signers", async () => {
      render(fixture({}));
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
      render(fixture({}));
      expect(screen.getByTestId("max-signers")).toHaveTextContent("out of 1");

      const addSignerButton = screen.getByRole("button", { name: "+ Add Signer" });
      fireEvent.click(addSignerButton);
      await waitFor(() => {
        expect(screen.getByTestId("max-signers")).toHaveTextContent("out of 2");
      });
    });
  });

  test("submit", async () => {
    const mockGoToStep = jest.fn((step: ReviewStep) => {});
    render(fixture({ goToStep: mockGoToStep }));

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

    await waitFor(() => {
      expect(mockGoToStep).toHaveBeenCalledWith({
        type: "review",
        data: {
          name: "some name",
          owner: mockImplicitAccount(0).address.pkh,
          signers: [{ val: mockImplicitAddress(1).pkh }],
          threshold: 1,
        },
      });
    });
  });
});
