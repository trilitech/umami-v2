import { type NFTBalance } from "@umami/core";
import { type RawPkh } from "@umami/tezos";
import { orderBy } from "lodash";

export const getIPFSurl = (ipfsPath?: string) =>
  ipfsPath?.replace("ipfs://", "https://ipfs.io/ipfs/");

export type NFTWithOwner = NFTBalance & { owner: RawPkh };

export const sortedByLastUpdate = <T extends NFTBalance | NFTWithOwner>(nfts: T[]): T[] =>
  orderBy(nfts, ["lastLevel", "id", "owner"], ["desc"]);
