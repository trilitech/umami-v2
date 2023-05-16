import {
  Button,
  Center,
  FormControl,
  FormLabel,
  ModalBody,
  ModalHeader,
  Select,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useAppDispatch } from "../../../utils/store/hooks";
import { LedgerAccount, AccountType } from "../../../types/Account";
import accountsSlice from "../../../utils/store/accountsSlice";
import { LedgerSigner } from "@taquito/ledger-signer";
import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import { useForm } from "react-hook-form";
import { Curves } from "@taquito/signer";
import { curvesToDerivationPath } from "../../../utils/tezos/helpers";
import { getRelativeDerivationPath } from "../../../utils/account/derivationPathUtils";

const accountsActions = accountsSlice.actions;

const EnterLedgerConfig = ({ onClose }: { onClose: () => void }) => {
  const [isLoading, setIsloading] = useState(false);
  const [derivationPath, setDerivationPath] = useState(
    getRelativeDerivationPath(0)
  );
  const [derivationType, setDerivationType] = useState<Curves>("ed25519");
  const toast = useToast();
  const dispatch = useAppDispatch();
  const { handleSubmit } = useForm({
    mode: "onBlur",
  });

  const handlePk = async (pk: string, pkh: string) => {
    const account: LedgerAccount = {
      derivationPath,
      curve: "ed25519",
      type: AccountType.LEDGER,
      pk: pk,
      pkh: pkh,
      label: "Ledger",
    };
    dispatch(accountsActions.add([account]));
    onClose();
  };

  const onSubmit = async () => {
    setIsloading(true);

    try {
      const transport = await TransportWebHID.create();
      const ledgerSigner = new LedgerSigner(
        transport,
        derivationPath,
        true,
        curvesToDerivationPath(derivationType)
      );
      const pk = await ledgerSigner.publicKey();
      const pkh = await ledgerSigner.publicKeyHash();
      toast({
        title: "Request sent to Ledger",
        description: "Open the Tezos app on your Ledger and accept the request",
      });
      handlePk(pk, pkh);
      await transport.close();
    } catch (error: any) {
      if (error.name === "PublicKeyRetrievalError") {
        toast({
          title: "Request rejected",
          description: "Please unlock your Ledger and open the Tezos app",
        });
      } else if (error.name === "InvalidStateError") {
        toast({
          title: "Request pending",
          description: "Check your ledger...",
        });
      } else if (error.name !== undefined) {
        toast({ title: "Request cancelled", description: error.name });
      } else {
        toast({ title: "Ledger Error", description: error.message });
      }
    }

    setIsloading(false);
  };

  return (
    <div>
      <ModalHeader textAlign={"center"}>Enter Ledger Config</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Center>
            <VStack width={300}>
              <FormControl>
                <FormLabel>Ledger configuration</FormLabel>
                <Select
                  id="derivationPath"
                  onChange={(e) => setDerivationPath(e.target.value)}
                >
                  {new Array(5).fill("", 0, 5).map((p, i) => (
                    <option value={getRelativeDerivationPath(i)}>
                      {getRelativeDerivationPath(i)}
                    </option>
                  ))}
                </Select>
                <Select
                  id="derivationType"
                  onChange={(e) => setDerivationType(e.target.value as Curves)}
                >
                  <option value={"ed25519"}>tz1 - ED25519</option>
                  <option value={"secp256k1"}>tz2 - secp256k1</option>
                  <option value={"p256"}>tz3 - P256</option>
                </Select>
              </FormControl>
              <Button
                type="submit"
                colorScheme="gray"
                title="Restore accounts"
                isLoading={isLoading}
              >
                Restore Ledger
              </Button>
            </VStack>
          </Center>
        </form>
      </ModalBody>
    </div>
  );
};

export default EnterLedgerConfig;
