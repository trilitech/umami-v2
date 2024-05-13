import { usePollBlockLevel } from "./usePollBlockLevel";
import { renderHook, waitFor } from "../../mocks/testUtils";
import { store } from "../redux/store";
import { getLatestBlockLevel } from "../tezos";

jest.mock("../tezos");
describe("usePollBlockLevel", () => {
  it("fetches the latest block and updates the state", async () => {
    jest.mocked(getLatestBlockLevel).mockResolvedValue(123);

    renderHook(() => usePollBlockLevel());

    await waitFor(() => expect(getLatestBlockLevel).toHaveBeenCalled());
    expect(store.getState().assets.blockLevel).toEqual(123);
  });
});
