import { orderBy } from "lodash";

import { type RawPkh } from "../../types/Address";
import { type NFTBalance } from "../../types/TokenBalance";

export const getIPFSurl = (ipfsPath?: string) =>
  ipfsPath?.replace("ipfs://", "https://ipfs.io/ipfs/");

export type NFTWithOwner = NFTBalance & { owner: RawPkh };

export const sortedByLastUpdate = <T extends NFTBalance | NFTWithOwner>(nfts: T[]): T[] =>
  orderBy(nfts, ["lastLevel", "id", "owner"], ["desc"]);
