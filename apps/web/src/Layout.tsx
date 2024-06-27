import { Card, Grid, GridItem } from "@chakra-ui/react";
import { Route, Routes } from "react-router";

import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { Activity } from "./views/Activity";
import { Earn } from "./views/Earn";
import { NFTs } from "./views/NFTs";
import { Tokens } from "./views/Tokens";

export const Layout = () => (
  <Grid
    className="layout"
    justifyContent="center"
    gridGap="20px"
    gridTemplateRows={{ base: "auto auto 1fr auto", lg: "auto auto 1fr auto" }}
    gridTemplateColumns={{ base: "1fr", lg: "340px minmax(min-content, 1060px)" }}
    gridTemplateAreas={{
      base: '"header" "sidebar" "main" "footer" "nav"',
      lg: `"header header" "sidebar nav" "sidebar main" "footer main"`,
    }}
  >
    <GridItem className="header" gridArea="header">
      <Header />
    </GridItem>
    <GridItem className="navbar" gridArea="nav">
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
