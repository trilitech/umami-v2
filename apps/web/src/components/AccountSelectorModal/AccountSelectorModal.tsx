import {
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  IconButton,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import { accountsActions, useGetAccountBalance, useImplicitAccounts } from "@umami/state";
import { prettyTezAmount } from "@umami/tezos";
import { capitalize, chain, sortBy } from "lodash";
import { useDispatch } from "react-redux";

import { ThreeDotsIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { AccountTile } from "../AccountTile";

export const AccountSelectorModal = () => {
  const accounts = useImplicitAccounts();
  const color = useColor();
  const getBalance = useGetAccountBalance();

  const dispatch = useDispatch();
  const { onClose } = useDynamicModalContext();

  const groupedAccounts = chain(accounts)
    .groupBy(acc => acc.type)
    .mapValues(accounts => sortBy(accounts, acc => acc.label))
    .value();

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
          divider={<Divider borderColor={color("100")} />}
        >
          {Object.entries(groupedAccounts).map(([type, accounts]) => (
            <Flex key={type} flexDirection="column" width="100%">
              <Center
                justifyContent="space-between"
                marginBottom="18px"
                paddingRight="20px"
                paddingLeft="12px"
              >
                <Heading color={color("900")} size="sm">
                  {capitalize(type)}
                </Heading>
                <IconButton
                  color={color("500")}
                  background="transparent"
                  aria-label="actions"
                  icon={<ThreeDotsIcon />}
                  size="xs"
                />
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
                      <IconButton
                        alignSelf="flex-end"
                        color={color("500")}
                        background="transparent"
                        aria-label="Account actions"
                        icon={<ThreeDotsIcon />}
                        onClick={event => event.stopPropagation()}
                        size="xs"
                      />

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

        <Button width="full" size="lg" variant="primary">
          Add Account
        </Button>
      </ModalBody>
    </ModalContent>
  );
};
