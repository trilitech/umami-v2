import {
  Box,
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
  useDefaultAccount,
  useGetAccountBalance,
  useImplicitAccounts,
  useRemoveMnemonic,
  useRemoveNonMnemonic,
} from "@umami/state";
import { prettyTezAmount } from "@umami/tezos";
import { groupBy } from "lodash";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import { AccountSelectorPopover } from "./AccountSelectorPopover";
import { PlusCircleIcon, TrashIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { trackAccountEvent } from "../../utils/analytics";
import { AccountTile } from "../AccountTile";
import { ModalCloseButton } from "../CloseButton";
import { DeriveMnemonicAccountModal } from "./DeriveMnemonicAccountModal";
import { ConfirmationModal } from "../ConfirmationModal";
import { HandleRemoveDefaultAccount, removeDefaultAccountDescription } from "./RemoveAccountModal";
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
  const defaultAccount = useDefaultAccount();
  if (!defaultAccount) {
    throw new Error("Default account not found");
  }

  const lastItemRef = useRef<HTMLDivElement>(null);
  const [showShadow, setShowShadow] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowShadow(!entry.isIntersecting);
      },
      {
        threshold: 1,
      }
    );

    if (lastItemRef.current) {
      observer.observe(lastItemRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const dispatch = useDispatch();

  const groupedAccounts = groupBy(implicitAccounts, getAccountGroupLabel);

  const showDeriveAccountButton = (account?: ImplicitAccount) =>
    account && account.type === "mnemonic";

  const buttonLabel = (isDefaultAccount: boolean) =>
    isDefaultAccount ? "Remove & off-board" : "Remove";
  const description = (isDefaultAccount: boolean, type: string) => {
    const isMnemonic = type.toLowerCase().includes("seedphrase");

    if (isDefaultAccount) {
      return removeDefaultAccountDescription(type);
    } else if (isMnemonic) {
      return `Are you sure you want to remove all accounts derived from the ${type}? You will need to manually import them again. \n\n<b>Make sure your mnemonic phrase is securely saved. Losing this phrase could result in permanent loss of access to your data.</b>`;
    } else {
      return `Are you sure you want to remove all of your ${type}? You will need to manually import them again.`;
    }
  };

  const handleAddAccount = () => {
    trackAccountEvent("add_account");

    return openWith(<OnboardOptionsModal />);
  };

  const onRemove = (type: string, accounts: Account[]) => {
    const account = accounts[0];

    const isDefaultAccount = accounts.some(a => a.address.pkh === defaultAccount.address.pkh);

    return openWith(
      <ConfirmationModal
        buttonLabel={buttonLabel(isDefaultAccount)}
        closeOnSubmit={isDefaultAccount}
        description={description(isDefaultAccount, type)}
        onSubmit={async () => {
          if (isDefaultAccount) {
            await HandleRemoveDefaultAccount();
          } else {
            if (account.type === "mnemonic") {
              removeMnemonic(account.seedFingerPrint);
            } else if (account.type !== "multisig") {
              removeNonMnemonic(account.type);
            }
            goBack();
          }
        }}
        title="Remove all accounts"
      />
    );
  };

  return (
    <ModalContent>
      <ModalCloseButton />
      <ModalBody flexDirection="column">
        <VStack
          overflowY="auto"
          width="100%"
          maxHeight="430px"
          divider={<Divider _last={{ display: "none" }} />}
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
                    {showDeriveAccountButton(accounts[0]) && (
                      <IconButton
                        color={color("500")}
                        aria-label={`Add ${type} account`}
                        icon={<PlusCircleIcon />}
                        onClick={() => {
                          trackAccountEvent("derive_account_from_mnemonic");

                          return openWith(
                            <DeriveMnemonicAccountModal account={accounts[0] as MnemonicAccount} />
                          );
                        }}
                        size="sm"
                        variant="ghost"
                      />
                    )}
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

          {/* This is a hack to toggle the shadow on the footer button*/}
          <Box ref={lastItemRef} paddingBottom="40px" />
        </VStack>
      </ModalBody>
      <ModalFooter
        position="relative"
        height="23px"
        margin="0"
        paddingX={{ base: "32px", md: "42px" }}
      >
        <Flex
          position="absolute"
          top="-25px"
          justifyContent="center"
          width="full"
          padding="8px"
          background="white"
          borderRadius="100px"
          boxShadow={
            showShadow
              ? color(
                  "0px -4px 10px 0px rgba(45, 55, 72, 0.10)",
                  "0px -4px 10px 0px rgba(0, 0, 0, 0.20)"
                )
              : "transparent"
          }
          transition="box-shadow 0.2s ease-in"
          backdropFilter="blur(40px)"
        >
          <Button width="full" onClick={handleAddAccount} variant="primary">
            Add account
          </Button>
        </Flex>
      </ModalFooter>
    </ModalContent>
  );
};
