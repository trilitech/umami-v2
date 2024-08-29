import { Box, Card, CardBody, Flex } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router";

import { Activity } from "../../views/Activity";
import { Earn } from "../../views/Earn";
import { NFTs } from "../../views/NFTs";
import { Tokens } from "../../views/Tokens";

export const Main = () => (
  <Box
    overflowY="auto"
    height={{ lg: "calc(100% + 29px)" }}
    marginTop={{ lg: "-75px" }}
    paddingTop={{ lg: "75px" }}
    borderRadius="30px"
  >
    <Card minHeight="full" borderRadius="30px">
      <CardBody
        as={Flex}
        padding={{
          base: "18px",
          lg: "40px",
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
