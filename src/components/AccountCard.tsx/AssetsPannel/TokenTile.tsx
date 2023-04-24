import { Box } from "@chakra-ui/react";
import React from "react";
import {
  FA12Token,
  FA2Token,
  getTokenName,
  getTokenPrettyAmmount,
  getTokenSymbol,
} from "../../../types/Asset";

const TokenTile = ({ token }: { token: FA12Token | FA2Token }) => {
  const name = getTokenName(token);
  const symbol = getTokenSymbol(token);
  const prettyAmount = getTokenPrettyAmmount(token);
  return <Box>{prettyAmount}</Box>;
};

export default TokenTile;
