export const formatPkh = (pkh: string) => {
  return `${pkh.slice(0, 5)}...${pkh.slice(-5, pkh.length)}`;
};

export const formatName = (name: string, len: number) => {
  return name.length > len ? name.slice(0, len) + "..." : name;
};
