import {
  BeaconMessageType,
  BeaconResponseInputMessage,
  PermissionRequestOutput,
} from "@airgap/beacon-wallet";
import {
  AspectRatio,
  Button,
  FormControl,
  Image,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useForm } from "react-hook-form";
import { OwnedImplicitAccountsAutocomplete } from "../../../../components/AddressAutocomplete";
import { useImplicitAccounts } from "../../../hooks/accountHooks";
import { walletClient } from "../../beacon";

const PermissionRequestPanel: React.FC<{
  request: PermissionRequestOutput;
  onSuccess: () => void;
}> = ({ request, onSuccess: onSubmit }) => {
  const accounts = useImplicitAccounts();
  const defaultAddress = accounts[0].address.pkh;
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<{ address: string }>({ defaultValues: { address: defaultAddress } });

  const grant = async () => {
    const account = accounts.find(acc => acc.address.pkh === getValues().address);
    if (!account) {
      throw new Error("No account selected");
    }
    const response: BeaconResponseInputMessage = {
      type: BeaconMessageType.PermissionResponse,
      network: { type: request.network.type }, // Use the same network that the user requested
      scopes: request.scopes,
      id: request.id,
      publicKey: account.pk,
    };

    await walletClient.respond(response);
    onSubmit();
  };

  return (
    <ModalContent>
      <ModalHeader>Permission Request from {request.appMetadata.name}</ModalHeader>

      <ModalCloseButton />
      <ModalBody>
        <FormControl isInvalid={!!errors.address}>
          <OwnedImplicitAccountsAutocomplete
            label="Select Account"
            allowUnknown={false}
            setValue={setValue}
            inputName="address"
            register={register}
            initialPkhValue={defaultAddress}
          />
        </FormControl>
        <AspectRatio mt={2} mb={2} width="100%" ratio={1}>
          <Image width="100%" height={40} src={request.appMetadata.icon} />
        </AspectRatio>
        <Text>{request.network.type}</Text>
        <Text>{request.senderId}</Text>
        <Text>{JSON.stringify(request.scopes)}</Text>
      </ModalBody>

      <ModalFooter>
        <Button isDisabled={!!errors.address} onClick={_ => grant()}>
          Grant
        </Button>
      </ModalFooter>
    </ModalContent>
  );
};

export default PermissionRequestPanel;
