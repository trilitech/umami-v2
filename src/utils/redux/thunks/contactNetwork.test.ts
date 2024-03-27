import { fromPairs } from "lodash";

import { setNetworksForContacts } from "./contactNetwork";
import { mockContractAddress, mockImplicitAddress } from "../../../mocks/factories";
import { useGetNetworksForContracts } from "../../multisig/helpers";
import { store } from "../store";

jest.mock("../../multisig/helpers");

const mockUseGetNetworksForContracts = jest.mocked(useGetNetworksForContracts);

const mockNetworksForContract = jest.fn();

describe("setNetworksForContacts thunk", () => {
  const implicitPkh = mockImplicitAddress(0).pkh;
  const mainnetPkh = mockContractAddress(0).pkh;
  const ghostnetPkh = mockContractAddress(1).pkh;
  const absentPkh = mockContractAddress(2).pkh;

  beforeEach(() => {
    mockUseGetNetworksForContracts.mockReturnValue(mockNetworksForContract);
    mockNetworksForContract.mockResolvedValue(
      new Map([
        [mainnetPkh, "mainnet"],
        [ghostnetPkh, "ghostnet"],
      ])
    );
  });

  it("updates network for saved contacts", async () => {
    const action = await store.dispatch<any>(
      setNetworksForContacts({
        oldContacts: fromPairs([
          [implicitPkh, { name: "Implicit Contact", pkh: implicitPkh }],
          [mainnetPkh, { name: "Mainnet Contact", pkh: mainnetPkh }],
          [ghostnetPkh, { name: "Ghostnet Contact", pkh: ghostnetPkh }],
          [absentPkh, { name: "Absent Contact", pkh: absentPkh }],
        ]),
      })
    );
    expect(action.type).toEqual("contacts/setNetworksForContacts/fulfilled");

    const { updatedContacts } = action.payload;

    expect(updatedContacts).toEqual(
      fromPairs([
        [implicitPkh, { name: "Implicit Contact", pkh: implicitPkh, network: undefined }],
        [mainnetPkh, { name: "Mainnet Contact", pkh: mainnetPkh, network: "mainnet" }],
        [ghostnetPkh, { name: "Ghostnet Contact", pkh: ghostnetPkh, network: "ghostnet" }],
      ])
    );
  });
});
