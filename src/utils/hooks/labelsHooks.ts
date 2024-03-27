import { useContacts } from "./contactsHooks";
import { useAllAccounts } from "./getAccountDataHooks";

/** Hook for validating name for account or contact. */
export const useValidateName = (oldName?: string | undefined) => {
  const isUniqueLabel = useIsUniqueLabel();

  return (name: string) => {
    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      return "Name should not be empty";
    }
    if (oldName !== undefined && trimmedName === oldName) {
      return "Name was not changed";
    }
    if (!isUniqueLabel(trimmedName)) {
      return "Name must be unique across all accounts and contacts";
    }
    return true;
  };
};

/** Hook for generating unique account labels. */
export const useGetNextAvailableAccountLabels = () => {
  const isUniqueLabel = useIsUniqueLabel();

  return (labelPrefix: string, count: number = 1) => {
    const labels = [];
    for (let index = 1; labels.length < count; index++) {
      const nextLabel = index === 1 ? labelPrefix : `${labelPrefix} ${index}`;
      if (isUniqueLabel(nextLabel)) {
        labels.push(nextLabel);
      }
    }
    return labels;
  };
};

const useIsUniqueLabel = () => {
  const accountLabels = useAllAccounts().map(account => account.label);
  const contactNames = Object.values(useContacts()).map(contact => contact.name);

  return (label: string) => ![...accountLabels, ...contactNames].includes(label);
};
