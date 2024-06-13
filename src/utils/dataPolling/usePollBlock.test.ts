import { usePollBlock } from "./usePollBlock";
import { renderHook, waitFor } from "../../mocks/testUtils";
import { store } from "../redux/store";
import { getLatestBlock } from "../tezos";

jest.mock("../tezos");
describe("usePollBlock", () => {
  it("fetches the latest block and updates the state", async () => {
    jest.mocked(getLatestBlock).mockResolvedValue({ level: 123, cycle: 5 });

    renderHook(() => usePollBlock());

    await waitFor(() => expect(getLatestBlock).toHaveBeenCalled());
    expect(store.getState().assets.block).toEqual({ level: 123, cycle: 5 });
  });
});
