import { waitFor } from "@testing-library/react";

import { accountsMigrations, mainStoreMigrations } from "./migrations";
import {
  mockContractAddress,
  mockImplicitAddress,
  mockSecretKeyAccount,
} from "../../mocks/factories";
import { GHOSTNET, MAINNET } from "../../types/Network";
import axios from "axios";


jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

//jest.mock("../multisig/helpers");
//const mockedGetNetworksForContracts = jest.mocked(getNetworksForContracts);

describe("migrations", () => {
  describe("main", () => {
    it("0", () => {
      expect(mainStoreMigrations[0]({ multisigs: {} })).toEqual({ multisigs: { labelsMap: {} } });
    });

    it("1", () => {
      expect(mainStoreMigrations[1]({})).toEqual({
        announcement: {
          html: "",
          seen: true,
        },
      });
    });

    // TODO: add test 3

  /*  it("4", async () => {
      const implicitPkh = mockImplicitAddress(0).pkh;
      const mainnetPkh = mockContractAddress(0).pkh;
      const ghostnetPkh = mockContractAddress(1).pkh;
      const absentPkh = mockContractAddress(2).pkh;
      
      mockedGetNetworksForContracts.mockResolvedValue(
          new Map([
            [mainnetPkh, "mainnet"],
            [ghostnetPkh, "ghostnet"],
          ])
      );

      const x = mainStoreMigrations[4]({
        networks: {
          current: [GHOSTNET],
          available: [[MAINNET, GHOSTNET]],
        },
        contacts: {
          implicitPkh: { name: "Implicit Contact", pkh: implicitPkh },
          mainnetPkh: { name: "Mainnet Contact", pkh: mainnetPkh },
          ghostnetPkh: { name: "Ghostnet Contact", pkh: ghostnetPkh },
          absentPkh: { name: "Absent Contact", pkh: absentPkh },
        },
      });

      await waitFor(() =>
        expect(x).toEqual({
          contacts: {
            implicitPkh: { name: "Implicit Contact", pkh: implicitPkh, network: undefined },
            mainnetPkh: { name: "Mainnet Contact", pkh: mainnetPkh, network: "mainnet" },
            ghostnetPkh: { name: "Ghostnet Contact", pkh: ghostnetPkh, network: "ghostnet" },
          },
        })
      );
    });*/
  });

  describe("accounts", () => {
    it("2", () => {
      expect(
        accountsMigrations[2]({ items: [{ ...mockSecretKeyAccount(0), curve: undefined }] })
      ).toEqual({
        items: [
          {
            ...mockSecretKeyAccount(0),
            curve: "ed25519",
          },
        ],
      });
    });
  });
});
