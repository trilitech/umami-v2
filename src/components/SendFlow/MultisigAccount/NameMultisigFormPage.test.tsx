import { Modal } from "@chakra-ui/react";
import { fireEvent, screen, waitFor } from "@testing-library/react";

import { NameMultisigFormPage } from "./NameMultisigFormPage";
import { mockMnemonicAccount } from "../../../mocks/factories";
import { addAccount } from "../../../mocks/helpers";
import { render } from "../../../mocks/testUtils";

const fixture = () => {
  return (
    <Modal isOpen={true} onClose={() => {}}>
      <NameMultisigFormPage />
    </Modal>
  );
};

const renderEmptyForm = async () => {
  render(fixture());
  await waitFor(() => {
    expect(screen.getByText("Continue")).toBeEnabled();
  });
};

describe("NameMultisigFormPage", () => {
  // TODO: does not have back button

  // title
  // subtitle

  describe("name field", () => {
    it("is empty by default", async () => {
      renderEmptyForm();

      expect(screen.getByLabelText("Account Name")).toHaveValue("");
    });

    /*   it("is optional", async () => {
      render(fixture());

      fireEvent.blur(screen.getByLabelText("Name the Contract"));
      await waitFor(() => {
        expect(screen.getByTestId("name-error")).toHaveTextContent("Name is required");
      });
    }); */

    it("checks that name is unique", async () => {
      addAccount(mockMnemonicAccount(1, "Some name"));
      renderEmptyForm();

      const input = screen.getByLabelText("Account Name");
      fireEvent.change(input, { target: { value: "Some name" } });
      fireEvent.blur(input);

      await waitFor(() => {
        expect(screen.getByTestId("name-error")).toHaveTextContent(
          "Name must be unique across all accounts and contacts"
        );
      });
    });
  });

  /*it("can be rendered with preselected values", async () => {
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
      mockContractOrigination(
        0,
        makeStorageJSON(mockImplicitAccount(0).address.pkh, [mockImplicitAddress(1).pkh], "1"),
        contract
      ),
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
  });*/
});
