import { Box, Card, CardBody, Flex } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router";

import { Activity } from "../../views/Activity";
import { Earn } from "../../views/Earn";
import { NFTs } from "../../views/NFTs";
import { Tokens } from "../../views/Tokens";

export const Main = () => (
  <Box
    overflowY="auto"
    height={{ base: "100%", md: "calc(100% + 29px)" }}
    marginTop={{ md: "-75px" }}
    paddingTop={{ md: "75px" }}
    borderRadius="30px"
  >
    <Card
      height={{ base: "100%", md: "auto" }}
      minHeight={{ base: "initial", md: "full" }}
      borderRadius="30px"
    >
      <CardBody
        as={Flex}
        padding={{
          base: "18px",
          md: "40px",
        }}
      >
        <Routes>
          <Route element={<Tokens />} path="/tokens" />
          <Route element={<NFTs />} path="/nfts" />
          <Route element={<Earn />} path="/earn" />
          <Route element={<Activity />} path="/activity" />
          <Route element={<Navigate to="/tokens" />} path="/*" />
        </Routes>
      </CardBody>
    </Card>
  </Box>
);
