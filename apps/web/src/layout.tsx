import { Card, Grid, GridItem } from "@chakra-ui/react";
import { Route, Routes } from "react-router";

import { Footer } from "./components/Footer/Footer";
import { Header } from "./components/Header/Header";
import { Navbar } from "./components/Navbar/Navbar";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { Activity } from "./views/Activity/Activity";
import { Earn } from "./views/Earn/Earn";
import { NFTs } from "./views/NFTs/NFTs";
import { Tokens } from "./views/Tokens/Tokens";

export const Layout = () => (
  <Grid
    justifyContent="center"
    gridGap="20px"
    gridTemplateRows="auto auto 1fr auto"
    gridTemplateColumns="340px minmax(min-content, 1060px)"
    gridTemplateAreas={`"header header" "sidebar nav" "sidebar main" "footer main"`}
    height="calc(100vh - 20px)"
  >
    <GridItem gridArea="header">
      <Header />
    </GridItem>
    <GridItem gridArea="nav">
      <Navbar />
    </GridItem>
    <GridItem gridArea="main">
      <Card padding="40px" borderRadius="30px">
        <Routes>
          <Route element={<Activity />} path="/" />
          <Route element={<Activity />} path="/activity" />
          <Route element={<NFTs />} path="/nfts" />
          <Route element={<Tokens />} path="/tokens" />
          <Route element={<Earn />} path="/earn" />
        </Routes>
      </Card>
    </GridItem>
    <GridItem gridArea="sidebar">
      <Sidebar />
    </GridItem>
    <GridItem gridArea="footer" marginBottom="40px">
      <Footer />
    </GridItem>
  </Grid>
);
