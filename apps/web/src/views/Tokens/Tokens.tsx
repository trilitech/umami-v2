import { Flex } from "@chakra-ui/react";

import { Token } from "./Token";
import { EmptyMessage } from "../../components/EmptyMessage";

const mockedTokens = [
  {
    title: "Token 1",
    address: "0x1234567890",
    amount: "100",
    price: "0.1",
  },
  {
    title: "Token 1",
    address: "0x1234567890",
    amount: "100",
    price: "0.1",
  },
  {
    title: "Token 1",
    address: "0x1234567890",
    amount: "100",
    price: "0.1",
  },
  {
    title: "Token 1",
    address: "0x1234567890",
    amount: "100",
    price: "0.1",
  },
  {
    title: "Token 1",
    address: "0x1234567890",
    amount: "100",
    price: "0.1",
  },
  {
    title: "Token 1",
    address: "0x1234567890",
    amount: "100",
    price: "0.1",
  },
  {
    title: "Token 1",
    address: "0x1234567890",
    amount: "100",
    price: "0.1",
  },
  {
    title: "Token 1",
    address: "0x1234567890",
    amount: "100",
    price: "0.1",
  },
];

export const Tokens = () => (
  <Flex flexDirection="column" width="full">
    {mockedTokens.length ? (
      mockedTokens.map(token => <Token key={token.address} token={token} />)
    ) : (
      <EmptyMessage subtitle="Tokens" title="Tokens" />
    )}
  </Flex>
);
