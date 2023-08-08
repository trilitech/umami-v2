export const formatPkh = (pkh: string) => {
  return `${pkh.slice(0, 5)}...${pkh.slice(-5, pkh.length)}`;
};
