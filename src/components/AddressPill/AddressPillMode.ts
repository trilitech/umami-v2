export type AddressPillMode =
  | { type: "default" }
  | { type: "removable"; onRemove: () => void }
  | { type: "no_icons" };
