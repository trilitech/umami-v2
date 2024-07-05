import { Card } from "@chakra-ui/react";
import { Route, Routes } from "react-router";

import { useColor } from "../../styles/useColor";
import { Activity } from "../../views/Activity";
import { Earn } from "../../views/Earn";
import { NFTs } from "../../views/NFTs";
import { Tokens } from "../../views/Tokens";

export const Main = () => {
  const color = useColor();

  return (
    <Card
      className="main"
      overflow="auto"
      height="full"
      padding={{
        base: "12px",
        lg: "40px",
      }}
      borderBottom={{
        base: "none",
        lg: `36px solid ${color("white")}`,
      }}
      borderRadius="30px"
    >
      <Routes>
        <Route element={<Activity />} path="/" />
        <Route element={<Activity />} path="/activity" />
        <Route element={<NFTs />} path="/nfts" />
        <Route element={<Tokens />} path="/tokens" />
        <Route element={<Earn />} path="/earn" />
      </Routes>
    </Card>
  );
};
