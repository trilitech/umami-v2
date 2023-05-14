import { ModalBody, ModalHeader, useToast } from "@chakra-ui/react";
import { useRef, useState } from "react";
import {
  useCheckPasswordValidity,
  useRestore,
} from "../../../utils/hooks/accountHooks";
import { EnterAndComfirmPassword } from "./password/EnterAndConfirmPassword";
import EnterPassword from "./password/EnterPassword";
import { EnterSeed } from "./EnterSeed";
import { GenerateSeedAndNameAccount } from "./GenerateSeed";
import ModalContentWrapper from "../ModalContentWrapper";
import { SupportedIcons } from "../../CircleIcon";

const EnterSeedAndSave = ({
  onClose,
  generateSeed,
}: {
  onClose: () => void;
  generateSeed?: boolean;
}) => {
  const [seedPhrase, setSeedPhrase] = useState<string>();
  const labelRef = useRef<string>();
  const restore = useRestore();
  const checkPassword = useCheckPasswordValidity();
  const passwordHasBeenSet = checkPassword !== null;

  const [isLoading, setIsloading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (password: string, seedPhrase: string) => {
    setIsloading(true);
    try {
      if (passwordHasBeenSet) {
        await checkPassword(password);
      }

      await restore(seedPhrase, password, labelRef.current).unwrap();

      toast({ title: "success" });
      onClose();
    } catch (error: any) {
      // How do we type error?
      toast({ title: "error", description: error.message });
    }
    setIsloading(false);
  };

  if (seedPhrase) {
    if (!passwordHasBeenSet) {
      return (
        <EnterAndComfirmPassword
          isLoading={isLoading}
          onSubmit={(p) => {
            handleSubmit(p, seedPhrase);
          }}
        />
      );
    }

    return (
      <EnterPassword
        isLoading={isLoading}
        onSubmit={(p) => {
          handleSubmit(p, seedPhrase);
        }}
      />
    );
  }

  if (generateSeed) {
    return (
      <ModalContentWrapper
        icon={SupportedIcons.diamont}
        title="Record Seed Phrase"
        subtitle="Please record the following 24 words in sequence in order to restore it in the future."
      >
        <GenerateSeedAndNameAccount
          onClickNext={(s, label) => {
            labelRef.current = label;
            setSeedPhrase(s);
          }}
        />
      </ModalContentWrapper>
    );
  }

  return (
    <div>
      <ModalHeader textAlign={"center"}>Enter seedphrase</ModalHeader>
      <ModalBody>
        <EnterSeed onSubmit={setSeedPhrase} />
      </ModalBody>
    </div>
  );
};

export default EnterSeedAndSave;
