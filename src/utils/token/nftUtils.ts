export const getIPFSurl = (ipfsPath?: string) =>
  ipfsPath?.replace("ipfs://", "https://ipfs.io/ipfs/");
