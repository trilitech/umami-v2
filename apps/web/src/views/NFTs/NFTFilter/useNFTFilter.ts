import { useCheckboxGroup } from "@chakra-ui/react";
import { sortedByLastUpdate, tokenContractName } from "@umami/core";
import { useCurrentAccount, useGetAccountNFTs } from "@umami/state";
import { chain, first } from "lodash";
import { useEffect } from "react";

/**
 * This hook should be used in a component that has an NFTFilter in it
 * It provides state management for a CheckboxGroup, which is used to filter
 * all NFTs owned by the current user
 *
 * @returns filtered, sorted NFTs list, checkbox group options and properties
 */
export const useNFTFilter = () => {
  const { value: selected, getCheckboxProps, setValue } = useCheckboxGroup();
  const account = useCurrentAccount()!;
  const address = account.address.pkh;
  const allNFTs = useGetAccountNFTs()(address);
  const options = chain(allNFTs)
    .groupBy(tokenContractName)
    .mapValues(group => group[0].contract)
    .toPairs()
    .sortBy(first)
    .value();

  // when we change a user, we should clear the selected filters
  useEffect(() => {
    setValue([]);
    // setValue keeps changing when we use it
    // if we add it to a dependency array it will cause an infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  const nfts = allNFTs.filter(nft => !selected.length || selected.includes(nft.contract));
  const selectedOptions = options.filter(option => selected.includes(option[1]));

  return {
    nfts: sortedByLastUpdate(nfts),
    options,
    getCheckboxProps,
    selected: selectedOptions,
  };
};
