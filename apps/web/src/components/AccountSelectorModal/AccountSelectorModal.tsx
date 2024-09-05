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
  ModalHeader,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import { getAccountGroupLabel } from "@umami/core";
import { accountsActions, useGetAccountBalance, useImplicitAccounts } from "@umami/state";
import { prettyTezAmount } from "@umami/tezos";
import { capitalize } from "lodash";
import { useDispatch } from "react-redux";

import { AccountSelectorPopover } from "./AccountSelectorPopover";
import { PlusIcon, TrashIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { AccountTile } from "../AccountTile";
import { ModalCloseButton } from "../CloseButton";
import { DeriveMnemonicAccount } from "../DeriveMnemonicAccount";
import { OnboardOptionsModal } from "../Onboarding/OnboardOptions";
import { useIsAccountVerified } from "../Onboarding/VerificationFlow";

export const AccountSelectorModal = () => {
  const accounts = useImplicitAccounts();
  const color = useColor();
  const getBalance = useGetAccountBalance();
  const isVerified = useIsAccountVerified();
  const { openWith, onClose } = useDynamicModalContext();

  const dispatch = useDispatch();

  const groupedAccounts = Object.groupBy(accounts, getAccountGroupLabel);

  return (
    <ModalContent>
      <ModalHeader>
        <ModalCloseButton />
      </ModalHeader>
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
                <Heading color={color("900")} size="sm">
                  {type.split("_").map(capitalize).join(" ")}
                </Heading>
                <Flex gap="12px">
                  <IconButton
                    color={color("500")}
                    aria-label={`Remove ${type} accounts`}
                    icon={<TrashIcon />}
                    size="sm"
                    variant="ghost"
                  />
                  <IconButton
                    color={color("500")}
                    aria-label={`Remove ${type} accounts`}
                    icon={<PlusIcon />}
                    onClick={() => openWith(<DeriveMnemonicAccount />)}
                    size="sm"
                    variant="ghost"
                  />
                </Flex>
              </Center>
              {accounts?.map(account => {
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
