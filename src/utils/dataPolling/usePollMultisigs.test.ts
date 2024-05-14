import { usePollMultisigs } from "./usePollMultisigs";
import { multisigs } from "../../mocks/multisig";
import { renderHook, waitFor } from "../../mocks/testUtils";
import { getRelevantMultisigContracts } from "../multisig/helpers";
import { store } from "../redux/store";

jest.mock("../multisig/helpers");

describe("usePollMultisigs", () => {
  it("fetches multisigs and updates the state", async () => {
    jest.mocked(getRelevantMultisigContracts).mockResolvedValue(multisigs);

    renderHook(() => usePollMultisigs());

    await waitFor(() => expect(getRelevantMultisigContracts).toHaveBeenCalledTimes(1));

    const expected = [
      { ...multisigs[0], label: "Multisig Account 0", type: "multisig" },
      { ...multisigs[1], label: "Multisig Account 1", type: "multisig" },
      { ...multisigs[2], label: "Multisig Account 2", type: "multisig" },
    ];

    expect(store.getState().multisigs.items).toEqual(expected);
  });
});
