import React from "react";

// No type definitions available.
// Lookup API here: https://github.com/tuhnik/react-identicons
const ReactIdenticons = require("react-identicons").default;

export const Identicon: React.FC<{ address: string }> = ({ address }) => {
  return <ReactIdenticons size={40} string={address} />;
};
