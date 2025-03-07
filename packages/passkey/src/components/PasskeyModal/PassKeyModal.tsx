import {
  Button,
  Center,
  Flex,
  Heading,
  Icon,
  Input,
  ModalBody,
  ModalContent,
  ModalHeader,
  Text,
  useToast,
} from "@chakra-ui/react";
import hj from "@hotjar/browser";
import { useState } from "react";

import { PasskeyIcon } from "../../assets/icons";
import { useColor } from "../../styles/useColor";
import { ModalCloseButton } from "../CloseButton";
import { authenticatePasskey, registerPasskey } from "./utils";


export const PasskeyModal = () => {
  const color = useColor();
  const toast = useToast();
  hj.stateChange("passkey");
  const [userName, setUserName] = useState<string | undefined>(undefined);
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

  const handlePasskey = async (callback: () => Promise<any>) => {
    if(userName){
      try {

        await callback();
      } catch (error: any) {
        toast({ description: "an error occurred", status: "error" });
      }
    } else {
      toast({ description: "Please enter a username", status: "warning" });
    }
  }

  const handleRegisterPasskey = async () => {
    const result = await registerPasskey(userName as string);
      handleResult(result);
  }
  const handleAuthenticatePasskey = async () => {
    const result = await authenticatePasskey(userName as string);
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
          <Input  onChange={(e) => setUserName(e.target.value)} placeholder="Enter your username" />
          <Button width="full" onClick={() => handlePasskey(handleRegisterPasskey)} size="lg" variant="primary">
            Register
          </Button>
          <Button width="full" onClick={() => handlePasskey(handleAuthenticatePasskey)} size="lg" variant="secondary">
           Authenticate
          </Button>
          {verified && <Text>User is logged in</Text>}
          {publicKey && <Text>Public Key: {publicKey}</Text>}
        </Flex>

      </Center>
      </ModalBody>
    </ModalContent>
  );
};
