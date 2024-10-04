import { Button, FormControl, FormErrorMessage, FormLabel, Input, VStack } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDynamicDrawerContext } from "@umami/components";
import { networksActions, useAppDispatch, useAvailableNetworks } from "@umami/state";
import { type Network } from "@umami/tezos";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { DrawerContentWrapper } from "../DrawerContentWrapper";

type EditNetworkMenuProps = {
  network?: Network;
};

const removeTrailingSlashes = (url: string) => url.replace(/\/+$/g, "");

const getNetworkSchema = (availableNetworks: Network[], network?: Network) =>
  z.object({
    name: network
      ? z.string().optional()
      : z
          .string()
          .min(1, "Name is required")
          .refine(name => !availableNetworks.find(n => n.name === name), {
            message: "Network with this name already exists",
          }),
    rpcUrl: z.string().min(1, "RPC URL is required").url("Enter a valid RPC URL"),
    tzktApiUrl: z.string().min(1, "Tzkt API URL is required").url("Enter a valid Tzkt API URL"),
    tzktExplorerUrl: z
      .string()
      .min(1, "Tzkt Explorer URL is required")
      .url("Enter a valid Tzkt Explorer URL"),
    buyTezUrl: z.string().url("Enter a valid Buy Tez URL").or(z.literal("")),
  });

export const EditNetworkMenu = ({ network }: EditNetworkMenuProps) => {
  const { goBack } = useDynamicDrawerContext();
  const dispatch = useAppDispatch();
  const availableNetworks = useAvailableNetworks();

  const {
    formState: { errors, isValid },
    register,
    handleSubmit,
  } = useForm<Network>({
    mode: "onBlur",
    defaultValues: network,
    resolver: zodResolver(getNetworkSchema(availableNetworks, network)),
  });

  const onSubmit = (network: Network) => {
    dispatch(networksActions.upsertNetwork(network));
    goBack();
  };

  return (
    <DrawerContentWrapper title={`${network ? "Edit" : "Add"} Network`}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack gap="30px" marginTop="40px" spacing="0">
          {!network && (
            <FormControl isInvalid={!!errors.name}>
              <FormLabel>Name</FormLabel>
              <Input placeholder="mainnet" {...register("name")} />
              {errors.name && <FormErrorMessage>{errors.name.message}</FormErrorMessage>}
            </FormControl>
          )}
          <FormControl isInvalid={!!errors.rpcUrl}>
            <FormLabel>RPC URL</FormLabel>
            <Input
              placeholder="https://prod.tcinfra.net/rpc/mainnet"
              {...register("rpcUrl", {
                setValueAs: removeTrailingSlashes,
              })}
            />
            {errors.rpcUrl && <FormErrorMessage>{errors.rpcUrl.message}</FormErrorMessage>}
          </FormControl>
          <FormControl isInvalid={!!errors.tzktApiUrl}>
            <FormLabel>Tzkt API URL</FormLabel>
            <Input
              placeholder="https://api.ghostnet.tzkt.io"
              {...register("tzktApiUrl", {
                setValueAs: removeTrailingSlashes,
              })}
            />
            {errors.tzktApiUrl && <FormErrorMessage>{errors.tzktApiUrl.message}</FormErrorMessage>}
          </FormControl>
          <FormControl isInvalid={!!errors.tzktExplorerUrl}>
            <FormLabel>Tzkt Explorer URL</FormLabel>
            <Input
              placeholder="https://ghostnet.tzkt.io"
              {...register("tzktExplorerUrl", {
                setValueAs: removeTrailingSlashes,
              })}
            />
            {errors.tzktExplorerUrl && (
              <FormErrorMessage>{errors.tzktExplorerUrl.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.buyTezUrl}>
            <FormLabel>Buy Tez URL</FormLabel>
            <Input placeholder="https://faucet.ghostnet.teztnets.com" {...register("buyTezUrl")} />

            {errors.buyTezUrl && <FormErrorMessage>{errors.buyTezUrl.message}</FormErrorMessage>}
          </FormControl>
        </VStack>
        <Button width="100%" marginTop="30px" isDisabled={!isValid} type="submit" variant="primary">
          {network ? "Save changes" : "Add network"}
        </Button>
      </form>
    </DrawerContentWrapper>
  );
};
