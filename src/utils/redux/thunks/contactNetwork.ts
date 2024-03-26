import { createAsyncThunk } from "@reduxjs/toolkit";
import { fromPairs } from "lodash";

import { isValidContractPkh, isValidImplicitPkh } from "../../../types/Address";
import { Contact, StoredContactInfo } from "../../../types/Contact";
import { useGetNetworksForContracts } from "../../multisig/helpers";
import { AppDispatch, RootState } from "../store";

export const setNetworksForContacts = createAsyncThunk<
  {
    updatedContacts: Record<string, StoredContactInfo>;
  },
  {
    oldContacts: Record<string, Contact>;
  },
  { dispatch: AppDispatch; state: RootState }
>("contacts/setNetworksForContacts", async ({ oldContacts }, { getState }) => {
  const getNetworksForContracts = useGetNetworksForContracts();
  console.log("oldContacts", oldContacts);

  const implicitAccounts = Object.values(oldContacts)
    .filter((contact: any) => isValidImplicitPkh(contact.pkh))
    .map((contact: any) => [contact.pkh, { ...contact, network: undefined }]);
  console.log(implicitAccounts);

  const contractPkhs = Object.values(oldContacts)
    .filter((contact: any) => isValidContractPkh(contact.pkh))
    .map((contact: any) => contact.pkh);
  console.log(contractPkhs);

  const contractsWithNetworks = await getNetworksForContracts(new Set(contractPkhs));
  console.log(contractsWithNetworks);
  const contractAccounts = [...contractsWithNetworks.entries()].map(([pkh, network]) => [
    pkh,
    { ...oldContacts[pkh], network },
  ]);

  return { updatedContacts: fromPairs([...implicitAccounts, ...contractAccounts]) };
});
