import {
  Button,
  Center,
  Flex,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";

import { authenticatePasskey, exampleSignTransaction, registerPasskey } from "../../utils";


export const Passkey = () => {
  const toast = useToast();
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

  const handlePasskey = async (callback: (userName: string) => Promise<any>) => {
    if(userName){
      try {

        await callback(userName);
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
      <Center flexDirection="column" gap="36px" width="full" height="full">
        <Flex flexDirection="column" gap="12px" width="full">
          <Input  onChange={(e) => setUserName(e.target.value)} placeholder="Enter your username" />
          <Button width="full" onClick={() => handlePasskey(handleRegisterPasskey)} size="lg" variant="primary">
            Register
          </Button>
          <Button width="full" onClick={() => handlePasskey(handleAuthenticatePasskey)} size="lg" variant="secondary">
           Authenticate
          </Button>
          <Button width="full" onClick={() => handlePasskey(exampleSignTransaction)} size="lg" variant="secondary">
           SignTransaction
          </Button>
          {verified && <Text>User is logged in</Text>}
          {publicKey && <Text>Public Key: {publicKey}</Text>}
        </Flex>

      </Center>
  );
};
