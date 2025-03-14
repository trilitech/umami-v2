import { screen } from "@testing-library/react";

export const getButtonByName = (name: string) => screen.getByRole("button", { name });
export const queryButtonByName = (name: string) => screen.queryByRole("button", { name });

export const getAddAccountButton = () => getButtonByName("Add account");
export const queryAddAccountButton = () => queryButtonByName("Add account");
export const getAddressBookButton = () => getButtonByName("Address book");
export const queryAddressBookButton = () => queryButtonByName("Address book");
export const getSaveBackupButton = () => getButtonByName("Save backup");
export const querySaveBackupBtn = () => queryButtonByName("Save backup");
export const getAppsButton = () => getButtonByName("Apps");
export const queryAppsButton = () => queryButtonByName("Apps");
export const getErrorLogsButton = () => getButtonByName("Error logs");
export const getNetworkButton = () => getButtonByName("Network");
export const queryNetworkButton = () => queryButtonByName("Network");
export const getLightModeButton = () => getButtonByName("Light mode");
export const getPasswordButton = () => getButtonByName("Password");
export const getSignOutButton = () => getButtonByName("Sign Out");
export const getLockUmamiButton = () => getButtonByName("Lock Umami");
export const queryLockUmamiButton = () => queryButtonByName("Lock Umami");
