import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import React from "react";
import { Baker } from "../../types/Baker";
import { useAppSelector } from "../../utils/store/hooks";
import { BakerSmallTile } from "./BakerSmallTile";

const renderBakerTile = (baker: Baker) => (
  <BakerSmallTile pkh={baker.address} label={baker.name} imageUrl={baker.logo} />
);

const renderBaker = (bakers: Baker[], selected: string) => {
  const referencedBaker = bakers.find(b => b.address === selected);

  if (!referencedBaker) {
    return <BakerSmallTile pkh={selected} />;
  }

  return renderBakerTile(referencedBaker);
};

export const BakerSelector: React.FC<{
  onSelect: (a: string) => void;
  selected?: string;
  disabled?: boolean;
}> = ({ onSelect = () => {}, selected, disabled }) => {
  const bakers = useAppSelector(s => s.assets.bakers);

  return (
    <Menu>
      <MenuButton
        isDisabled={disabled}
        data-testid="baker-selector"
        w="100%"
        textAlign="left"
        as={Button}
        rightIcon={<ChevronDownIcon />}
        h={16}
      >
        {selected === undefined ? "Select a Baker" : renderBaker(bakers, selected)}
      </MenuButton>
      <MenuList bg="umami.gray.900" maxH={40} overflow="scroll">
        {bakers.map(baker => (
          // TODO refactor with AccountTile in home
          <MenuItem
            onClick={() => {
              onSelect(baker.address);
            }}
            key={baker.address}
            minH="48px"
            w="100%"
            // TODO implement hover color that disapeared
            bg="umami.gray.900"
          >
            {renderBakerTile(baker)}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};
