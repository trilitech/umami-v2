export const executeParams = (
  params?: Partial<{
    fee: number;
    gasLimit: number;
    storageLimit: number;
  }>
) => ({
  fee: 0,
  gasLimit: 0,
  storageLimit: 0,
  ...params,
});
