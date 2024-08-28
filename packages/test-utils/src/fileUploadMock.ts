export const fileUploadMock = (value: any) => {
  const content = JSON.stringify(value);
  const file = new File([content], "backup.json", { type: "application/json" });
  Object.defineProperty(file, "text", { value: () => Promise.resolve(content) });
  return file;
};
