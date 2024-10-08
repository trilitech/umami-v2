import { Grid, GridItem } from "@chakra-ui/react";
import { useDataPolling } from "@umami/data-polling";

import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Main } from "./components/Main";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";

export const Layout = () => {
  useDataPolling();

  return (
    <Grid
      justifyContent="center"
      gridGap={{ md: "20px", base: "12px" }}
      gridTemplateRows={{ base: "auto auto 1fr auto", md: "auto auto 1fr auto" }}
      gridTemplateColumns={{ base: "1fr", md: "340px minmax(min-content, 1060px)" }}
      gridTemplateAreas={{
        base: '"header" "sidebar" "main" "footer" "nav"',
        md: `"header header" "sidebar nav" "sidebar main" "footer main"`,
      }}
      height={{ md: "100vh" }}
      minHeight={{ base: "100dvh" }}
      padding={{ md: "20px 46px 0", base: "54px 0 0" }}
      data-testid="signed-in-layout"
    >
      <GridItem
        position={{ base: "fixed", md: "static" }}
        zIndex={{ base: 2 }}
        top={{ base: 0 }}
        left={{ base: 0 }}
        gridArea="header"
        width={{ base: "100%" }}
        borderRadius={{ base: 0 }}
      >
        <Header />
      </GridItem>
      <GridItem
        position={{ base: "sticky" }}
        zIndex={{ base: 2 }}
        bottom={{ base: 0 }}
        gridArea="nav"
      >
        <Navbar />
      </GridItem>
      <GridItem
        gridArea="main"
        paddingX={{
          base: "12px",
          md: "0",
        }}
      >
        <Main />
      </GridItem>
      <GridItem
        gridArea="sidebar"
        paddingX={{
          base: "12px",
          md: "0",
        }}
      >
        <Sidebar />
      </GridItem>
      <GridItem
        gridArea="footer"
        marginTop={{ base: "20px" }}
        marginBottom={{ base: "20px", md: "46px" }}
      >
        <Footer />
      </GridItem>
    </Grid>
  );
};
