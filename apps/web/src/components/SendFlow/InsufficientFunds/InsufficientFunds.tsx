import {
  Button,
  Flex,
  Heading,
  Link,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";
import { useBuyTezUrl, useCurrentAccount } from "@umami/state";

import { ExternalLinkIcon, WalletIcon } from "../../../assets/icons";
import { useColor } from "../../../styles/useColor";
import { ModalCloseButton } from "../../CloseButton";

export const InsufficientFunds = () => {
  const color = useColor();
  const currentAccount = useCurrentAccount();
  const buyTezUrl = useBuyTezUrl(currentAccount!.address.pkh);

  const { onClose } = useDynamicModalContext();

  return (
    <ModalContent>
      <ModalHeader marginBottom="12px">
        <Flex alignItems="center" justifyContent="center" flexDirection="column" gap="18px">
          <WalletIcon width="24px" color={color("400")} />
          <Heading size="xl">Insufficient Funds</Heading>
        </Flex>
        <ModalCloseButton />
      </ModalHeader>
      <ModalBody>
        <Text color={color("700")} fontWeight="400" textAlign="center" size="md">
          Oops, looks like you don't have enough funds on your account.
        </Text>
      </ModalBody>
      <ModalFooter>
        <Button
          as={Link}
          width="full"
          href={buyTezUrl}
          isExternal
          leftIcon={<ExternalLinkIcon />}
          onClick={onClose}
          variant="primary"
        >
          Buy Tez
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};
