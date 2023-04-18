import {
  Button,
  Flex,
  ModalBody,
  ModalFooter,
  ModalHeader,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import AddGoogleAccountBtn from "./social/AddGoogleAccountBtn";
import EnterSeedAndSave from "./seedphrase/EnterOrGenerateSeed";
import CreateSocialAccount from "./social/CreateSocialAccount";

type Step =
  | { type: "enterExistingSeedphrase" }
  | { type: "generateNewSeedphrase" }
  | { type: "importSocial"; pk: string; pkh: string };

const CreateOrImportSecret: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const [step, setStep] = useState<Step | null>(null);

  if (step === null) {
    return (
      <>
        <ModalHeader textAlign={"center"}>Create account</ModalHeader>
        <ModalBody>
          <VStack>
            <Button
              w="100%"
              onClick={(_) => setStep({ type: "generateNewSeedphrase" })}
            >
              Create new secret
            </Button>
            <Button
              w="100%"
              onClick={(_) => setStep({ type: "enterExistingSeedphrase" })}
            >
              Import secret with recovery phrase
            </Button>
            <AddGoogleAccountBtn
              onSubmit={(pk, pkh) =>
                setStep({
                  type: "importSocial",
                  pk,
                  pkh,
                })
              }
            />
            <Button w="100%" isDisabled={true}>
              Import backup file
            </Button>
            <Button w="100%" isDisabled={true}>
              Connect ledger
            </Button>
          </VStack>
        </ModalBody>
        <ModalFooter justifyContent={"center"} flexDirection="column">
          <Flex mt={4} alignItems={"center"} justifyContent="space-between">
            <Button onClick={onClose}>Cancel</Button>
          </Flex>
        </ModalFooter>
      </>
    );
  }
  if (step.type === "importSocial") {
    return (
      <CreateSocialAccount pk={step.pk} pkh={step.pkh} onSuccess={onClose} />
    );
  }

  if (step.type === "generateNewSeedphrase") {
    return <EnterSeedAndSave generateSeed onClose={onClose} />;
  }
  if (step.type === "enterExistingSeedphrase") {
    return <EnterSeedAndSave onClose={onClose} />;
  }

  const error: never = step;
  throw new Error(error);
};

export default CreateOrImportSecret;
