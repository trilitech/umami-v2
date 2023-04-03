import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import React from "react";
import { Baker } from "../../types/Baker";
import { useAppSelector } from "../../utils/store/hooks";
import { BakerSmallTile } from "./BakerSmallTile";

const renderBaker = (baker: Baker) => (
  <BakerSmallTile
    pkh={baker.address}
    label={baker.name}
    imageUrl={baker.logo}
  />
);

export const BakerSelector: React.FC<{
  onSelect: (a: string) => void;
  selected?: string;
  isDisabled?: boolean;
}> = ({ onSelect = () => {}, selected, isDisabled }) => {
  const bakers = useAppSelector((s) => s.assets.bakers);

  const selectedBaker = bakers.find((b) => b.address === selected);

  return (
    <Menu>
      <MenuButton
        isDisabled={isDisabled}
        data-testid="baker-selector"
        w={"100%"}
        textAlign="left"
        as={Button}
        rightIcon={<ChevronDownIcon />}
        h={16}
      >
        {selectedBaker ? renderBaker(selectedBaker) : "Select a baker"}
      </MenuButton>
      <MenuList bg={"umami.gray.900"} maxH={40} overflow={"scroll"}>
        {bakers.map((baker) => (
          // TODO refactor with AccountTile in home
          <MenuItem
            onClick={() => {
              onSelect(baker.address);
            }}
            key={baker.address}
            minH="48px"
            w="100%"
            // TODO implement hover color that disapeared
            bg={"umami.gray.900"}
          >
            {renderBaker(baker)}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
