import { DAppsDrawerCard } from "./DAppsDrawerCard";
import { act, render, screen, userEvent } from "../../mocks/testUtils";
import * as beacon from "../../utils/beacon/beacon";

describe("<DAppsDrawerCard />", () => {
  it("has the drawer closed by default", () => {
    render(<DAppsDrawerCard />);

    expect(screen.queryByTestId("drawer-body")).not.toBeInTheDocument();
  });

  it("opens the drawer on card click", async () => {
    const user = userEvent.setup();

    render(<DAppsDrawerCard />);

    await act(() => user.click(screen.getByText("dApps")));

    expect(screen.getByTestId("drawer-body")).toBeVisible();
  });

  it("calls addPeer on button click with the copied text", async () => {
    const user = userEvent.setup();
    jest.spyOn(navigator.clipboard, "readText").mockResolvedValue("some text");
    const mockAddPeer = jest.fn();
    jest.spyOn(beacon, "useAddPeer").mockReturnValue(mockAddPeer);

    render(<DAppsDrawerCard />);

    await act(() => user.click(screen.getByText("dApps")));
    await act(() => user.click(screen.getByText("Connect with Pairing Request")));

    expect(mockAddPeer).toHaveBeenCalledWith("some text");
  });

  it("renders the dapps list", async () => {
    const user = userEvent.setup();

    render(<DAppsDrawerCard />);

    await act(() => user.click(screen.getByText("dApps")));

    expect(screen.getByTestId(/beacon-peers/)).toBeVisible();
  });
});
