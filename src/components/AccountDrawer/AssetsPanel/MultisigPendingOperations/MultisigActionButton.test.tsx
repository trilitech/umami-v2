import { MultisigActionButton } from "./MultisigActionButton";
import { act, render, screen, userEvent } from "../../../../mocks/testUtils";

describe("<MultisigActionButton />", () => {
  it("displays awaiting approval for external signers", () => {
    render(
      <MultisigActionButton
        approveOrExecute={jest.fn()}
        isLoading={false}
        signerState="awaitingApprovalByExternalSigner"
      />
    );

    expect(screen.getByTestId("multisig-signer-awaiting-approval")).toBeVisible();
    expect(screen.getByText("Awaiting Approval")).toBeVisible();
  });

  it("displays approved for a signers who has already approved", () => {
    render(
      <MultisigActionButton approveOrExecute={jest.fn()} isLoading={false} signerState="approved" />
    );

    expect(screen.getByTestId("multisig-signer-approved")).toBeVisible();
    expect(screen.getByText("Approved")).toBeVisible();
  });

  it("displays approve button for owned signers who still can approve", async () => {
    const user = userEvent.setup();
    const onClickSpy = jest.fn();
    render(
      <MultisigActionButton
        approveOrExecute={onClickSpy}
        isLoading={false}
        signerState="approvable"
      />
    );

    expect(screen.getByTestId("multisig-signer-button")).toBeVisible();

    await act(() => user.click(screen.getByRole("button", { name: "Approve" })));

    expect(onClickSpy).toHaveBeenCalled();
  });

  it("displays disabled approve button if it's loading", () => {
    render(
      <MultisigActionButton
        approveOrExecute={jest.fn()}
        isLoading={true}
        signerState="approvable"
      />
    );

    expect(screen.getByTestId("multisig-signer-button")).toBeDisabled();
  });

  it("displays execute button for owned signers who can execute", async () => {
    const user = userEvent.setup();
    const onClickSpy = jest.fn();
    render(
      <MultisigActionButton
        approveOrExecute={onClickSpy}
        isLoading={false}
        signerState="executable"
      />
    );

    expect(screen.getByTestId("multisig-signer-button")).toBeVisible();

    await act(() => user.click(screen.getByRole("button", { name: "Execute" })));

    expect(onClickSpy).toHaveBeenCalled();
  });

  it("displays disabled execute button if it's loading", () => {
    render(
      <MultisigActionButton
        approveOrExecute={jest.fn()}
        isLoading={true}
        signerState="executable"
      />
    );

    expect(screen.getByTestId("multisig-signer-button")).toBeDisabled();
  });
});
