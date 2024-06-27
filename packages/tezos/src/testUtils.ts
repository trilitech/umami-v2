import { type ContractAddress, type ImplicitAddress } from "./types";

const validContractAddresses = [
  "KT1QuofAgnsWffHzLA7D78rxytJruGHDe7XG",
  "KT1CSKPf2jeLpMmrgKquN2bCjBTkAcAdRVDy",
  "KT1EctCuorV2NfVb1XTQgvzJ88MQtWP8cMMv",
  "KT1Ex8LrDbCrZuTgmWin8eEo7HFw74jAqTvz",
];

export const mockContractAddress = (index: number): ContractAddress => ({
  type: "contract",
  pkh: validContractAddresses[index],
});

const validMockPkhs = [
  "tz1gUNyn3hmnEWqkusWPzxRaon1cs7ndWh7h",
  "tz1UZFB9kGauB6F5c2gfJo4hVcvrD8MeJ3Vf",
  "tz1ikfEcj3LmsmxpcC1RMZNzBHbEmybCc43D",
  "tz1g7Vk9dxDALJUp4w1UTnC41ssvRa7Q4XyS",
  "tz1i9imTXjMAW5HP5g3wq55Pcr43tDz8c3VZ",
  "tz1PB7jN9GnNppn8hEbrherUAt4n3bv3wgNn",
  "tz1cuj9Cgi19KMRi83UuypS89kXM435qdhmy",
  "tz1Kt4P8BCaP93AEV4eA7gmpRryWt5hznjCP",
  "tz1cX93Q3KsiTADpCC4f12TBvAmS5tw7CW19",
  "tz1NEKxGEHsFufk87CVZcrqWu8o22qh46GK6",
  "tz1W2hEsS1mj7dHPZ6267eeM4HDWJoG3s13n",
];

export const mockImplicitAddress = (index: number): ImplicitAddress => {
  if (index >= validMockPkhs.length) {
    throw Error("index out of bound");
  }
  return { type: "implicit", pkh: validMockPkhs[index] };
};

export const mockPk = (index: number) =>
  `edpkuwYWCugiYG7nMnVUdopFmyc3sbMSiLqsJHTQgGtVhtSdLSw6H${index}`;
