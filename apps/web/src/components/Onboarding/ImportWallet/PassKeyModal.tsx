import {
  Button,
  Center,
  Flex,
  Heading,
  Icon,
  ModalBody,
  ModalContent,
  ModalHeader,
  Text,
  useToast
} from "@chakra-ui/react";
import hj from "@hotjar/browser";

import { PasskeyIcon } from "../../../assets/icons";
import { useColor } from "../../../styles/useColor";
import { ModalCloseButton } from "../../CloseButton";
import { authenticatePasskey, registerPasskey } from "../../Passkey/utils";
import { useState } from "react";


export const PasskeyModal = () => {
  const color = useColor();
  const toast = useToast();
  hj.stateChange("passkey");
  const [verified, setVerified] = useState(false);
  const [publicKey, setPublicKey] = useState<string | undefined>(undefined);

  const handleResult = (result: any) => {
    setVerified(result.verified);
    setPublicKey(result.publicKey);

    if (result.verified) {
      toast({ description: "Authentication successful", status: "success" });
    } else {
      toast({ description: "Authentication failed", status: "error" });
    }
  }

  const handleRegisterPasskey = async () => {
    const result = await registerPasskey();
    handleResult(result);
  }
  const handleAuthenticatePasskey = async () => {
    const result = await authenticatePasskey();
    handleResult(result);
  }

  return (
    <ModalContent>
      <ModalHeader>
        <ModalCloseButton />
        <Center flexDirection="row" gap="16px">
          <Icon as={PasskeyIcon} width="24px" height="24px" color={color("400")} />
          <Heading size="xl">Passkey</Heading>
        </Center>
      </ModalHeader>

      <ModalBody>
      <Center flexDirection="column" gap="36px" width="full" height="full">
        <Flex flexDirection="column" gap="12px" width="full">
          <Button width="full" onClick={handleRegisterPasskey} size="lg" variant="primary">
            Register
          </Button>
          <Button width="full" onClick={handleAuthenticatePasskey} size="lg" variant="secondary">
            Login
          </Button>
          {publicKey && <Text>Public Key: {publicKey}</Text>}
        </Flex>

      </Center>
      </ModalBody>
    </ModalContent>
  );
};
