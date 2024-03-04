import { ShowSeedphrase } from "./ShowSeedphrase";
import { mnemonic1 } from "../../../mocks/mockMnemonic";
import { act, render, screen, userEvent } from "../../../mocks/testUtils";

const goToStepMock = jest.fn();

const fixture = () => {
  const account = { type: "mnemonic" as const, mnemonic: mnemonic1 };
  return <ShowSeedphrase account={account} goToStep={goToStepMock} />;
};

describe("<ShowSeedphrase />", () => {
  test("mnemonic is displayed", async () => {
    const user = userEvent.setup();
    render(fixture());

    mnemonic1.split(" ").forEach(word => {
      expect(screen.getByText(word)).toBeInTheDocument();
    });

    const confirmBtn = screen.getByRole("button", {
      name: "OK, I've recorded it",
    });
    expect(confirmBtn).toBeEnabled();
    await act(() => user.click(confirmBtn));

    expect(goToStepMock).toHaveBeenCalledWith({
      type: "verifySeedphrase",
      account: {
        type: "mnemonic",
        mnemonic: mnemonic1,
      },
    });
  });
});
