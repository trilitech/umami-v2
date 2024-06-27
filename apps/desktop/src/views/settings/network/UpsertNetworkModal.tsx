import {
  Button,
  FormControl,
  FormLabel,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react";
import { networksActions } from "@umami/state";
import { type Network } from "@umami/tezos";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";

import { DynamicModalContext } from "../../../components/DynamicModal";
import { FormErrorMessage } from "../../../components/FormErrorMessage";
import { useAvailableNetworks } from "../../../utils/hooks/networkHooks";

const removeTrailingSlashes = (url: string) => url.replace(/\/+$/g, "");

export const UpsertNetworkModal = ({ network }: { network?: Network }) => {
  const mode = network ? "edit" : "create";

  const { onClose } = useContext(DynamicModalContext);
  const dispatch = useDispatch();
  const availableNetworks = useAvailableNetworks();

  const {
    formState: { errors, isValid },
    register,
    handleSubmit,
  } = useForm<Network>({ mode: "onBlur", defaultValues: network });

  const onSubmit = (network: Network) => {
    dispatch(networksActions.upsertNetwork(network));
    onClose();
  };

  return (
    <ModalContent>
      <form onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader textAlign="center">
          {mode === "edit" ? "Edit" : "Add"} Network
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          {mode === "create" && (
            <FormControl marginTop="32px" marginBottom="24px" isInvalid={!!errors.name}>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="mainnet"
                {...register("name", {
                  required: "Name is required",
                  validate: name => {
                    if (availableNetworks.find(n => n.name === name)) {
                      return "Network with this name already exists";
                    }
                  },
                })}
              />
              {errors.name && <FormErrorMessage>{errors.name.message}</FormErrorMessage>}
            </FormControl>
          )}
          <FormControl marginBottom="24px" isInvalid={!!errors.rpcUrl}>
            <FormLabel>RPC URL</FormLabel>
            <Input
              placeholder="https://prod.tcinfra.net/rpc/mainnet"
              {...register("rpcUrl", {
                required: "RPC URL is required",
                setValueAs: removeTrailingSlashes,
              })}
            />
            {errors.rpcUrl && <FormErrorMessage>{errors.rpcUrl.message}</FormErrorMessage>}
          </FormControl>
          <FormControl marginBottom="24px" isInvalid={!!errors.tzktApiUrl}>
            <FormLabel>Tzkt API URL</FormLabel>
            <Input
              placeholder="https://api.ghostnet.tzkt.io"
              {...register("tzktApiUrl", {
                required: "Tzkt API URL is required",
                setValueAs: removeTrailingSlashes,
              })}
            />
            {errors.tzktApiUrl && <FormErrorMessage>{errors.tzktApiUrl.message}</FormErrorMessage>}
          </FormControl>
          <FormControl marginBottom="24px" isInvalid={!!errors.tzktExplorerUrl}>
            <FormLabel>Tzkt Explorer URL</FormLabel>
            <Input
              placeholder="https://ghostnet.tzkt.io"
              {...register("tzktExplorerUrl", {
                required: "Tzkt Explorer URL is required",
                setValueAs: removeTrailingSlashes,
              })}
            />
            {errors.tzktExplorerUrl && (
              <FormErrorMessage>{errors.tzktExplorerUrl.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl>
            <FormLabel>Buy Tez URL</FormLabel>
            <Input placeholder="https://faucet.ghostnet.teztnets.com" {...register("buyTezUrl")} />
          </FormControl>
          <ModalFooter>
            <Button width="100%" isDisabled={!isValid} onClick={() => {}} type="submit">
              {mode === "edit" ? "Save changes" : "Add network"}
            </Button>
          </ModalFooter>
        </ModalBody>
      </form>
    </ModalContent>
  );
};
