import {
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  IconButton,
  ModalBody,
  ModalContent,
  ModalFooter,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import {
  type Account,
  type ImplicitAccount,
  type MnemonicAccount,
  getAccountGroupLabel,
} from "@umami/core";
import {
  accountsActions,
  useGetAccountBalance,
  useImplicitAccounts,
  useRemoveMnemonic,
  useRemoveNonMnemonic,
} from "@umami/state";
import { prettyTezAmount } from "@umami/tezos";
import { groupBy } from "lodash";
import { useDispatch } from "react-redux";

import { AccountSelectorPopover } from "./AccountSelectorPopover";
import { PlusCircleIcon, TrashIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { AccountTile } from "../AccountTile";
import { ModalCloseButton } from "../CloseButton";
import { DeriveMnemonicAccountModal } from "./DeriveMnemonicAccountModal";
import { ConfirmationModal } from "../ConfirmationModal";
import { OnboardOptionsModal } from "../Onboarding/OnboardOptions";
import { useIsAccountVerified } from "../Onboarding/VerificationFlow";

export const AccountSelectorModal = () => {
  const implicitAccounts = useImplicitAccounts();
  const color = useColor();
  const getBalance = useGetAccountBalance();
  const isVerified = useIsAccountVerified();
  const removeMnemonic = useRemoveMnemonic();
  const removeNonMnemonic = useRemoveNonMnemonic();
  const { openWith, goBack, onClose } = useDynamicModalContext();

  const dispatch = useDispatch();

  const groupedAccounts = groupBy(implicitAccounts, getAccountGroupLabel);

  const handleDeriveAccount = (account?: ImplicitAccount) => {
    if (!account) {
      return;
    }

    switch (account.type) {
      case "mnemonic":
        return openWith(<DeriveMnemonicAccountModal account={account as MnemonicAccount} />);
      default:
        return openWith(<OnboardOptionsModal />);
    }
  };

  const buttonLabel = (isLast: boolean) => (isLast ? "Remove & Off-board" : "Remove");
  const description = (isLast: boolean, type: string) =>
    isLast
      ? "Removing all your accounts will off-board you from Umami. This will remove or reset all customized settings to their defaults. Personal data (including saved contacts, password and accounts) won't be affected."
      : `Are you sure you want to remove all accounts derived from the ${type}? You will need to manually import them again.`;

  const onRemove = (type: string, accounts: Account[]) => {
    const account = accounts[0];
    const isLast = accounts.length === implicitAccounts.length;

    return openWith(
      <ConfirmationModal
        buttonLabel={buttonLabel(isLast)}
        description={description(isLast, type)}
        onSubmit={() => {
          if (account.type === "mnemonic") {
            removeMnemonic(account.seedFingerPrint);
          } else if (account.type !== "multisig") {
            removeNonMnemonic(account.type);
          }
          goBack();
        }}
        title="Remove All Accounts"
      />
    );
  };

  return (
    <ModalContent>
      <ModalCloseButton />
      <ModalBody flexDirection="column" gap="18px">
        <VStack
          overflowY="auto"
          width="100%"
          maxHeight="400px"
          divider={<Divider />}
          spacing="18px"
        >
          {Object.entries(groupedAccounts).map(([type, accounts]) => (
            <Flex key={type} flexDirection="column" width="100%">
              <Center
                justifyContent="space-between"
                marginBottom="18px"
                paddingRight="17px"
                paddingLeft="12px"
              >
                <Heading color={color("900")} size="md">
                  {type}
                </Heading>
                {isVerified && (
                  <Flex gap="12px">
                    <IconButton
                      color={color("500")}
                      aria-label={`Remove ${type} accounts`}
                      icon={<TrashIcon />}
                      onClick={() => onRemove(type, accounts)}
                      size="sm"
                      variant="ghost"
                    />
                    <IconButton
                      color={color("500")}
                      aria-label={`Add ${type} account`}
                      icon={<PlusCircleIcon />}
                      onClick={() => handleDeriveAccount(accounts[0])}
                      size="sm"
                      variant="ghost"
                    />
                  </Flex>
                )}
              </Center>
              {accounts.map(account => {
                const address = account.address.pkh;
                const balance = getBalance(address);
                const onClick = () => {
                  dispatch(accountsActions.setCurrent(address));
                  onClose();
                };

                return (
                  <AccountTile key={address} account={account} onClick={onClick}>
                    <Flex justifyContent="center" flexDirection="column" gap="2px">
                      {isVerified && <AccountSelectorPopover account={account} />}
                      <Text color={color("700")} size="sm">
                        {balance ? prettyTezAmount(balance) : "\u00A0"}
                      </Text>
                    </Flex>
                  </AccountTile>
                );
              })}
            </Flex>
          ))}
        </VStack>
      </ModalBody>
      <ModalFooter>
        {isVerified && (
          <Button width="full" onClick={() => openWith(<OnboardOptionsModal />)} variant="primary">
            Add Account
          </Button>
        )}
      </ModalFooter>
    </ModalContent>
  );
};
