export type tzktGetAddressResponseType = {
  type:
    | "user"
    | "delegate"
    | "contract"
    | "ghost"
    | "rollup"
    | "smart_rollup"
    | "empty";
};
