import { Box } from "@chakra-ui/react";
import React from "react";
import {
  FA12Token,
  FA2Token,
  getTokenName,
  getTokenSymbol,
} from "../../../types/Asset";

const TokenTile = ({ token }: { token: FA12Token | FA2Token }) => {
  const name = getTokenName(token);
  const symbol = getTokenSymbol(token);
  return <Box>TokenTile</Box>;
};

export default TokenTile;
