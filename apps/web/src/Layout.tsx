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
      className="layout"
      justifyContent="center"
      gridGap={{ lg: "20px", base: "12px" }}
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
      <GridItem
        gridArea="main"
        paddingX={{
          base: "12px",
          lg: "0",
        }}
      >
        <Main />
      </GridItem>
      <GridItem
        gridArea="sidebar"
        paddingX={{
          base: "12px",
          lg: "0",
        }}
      >
        <Sidebar />
      </GridItem>
      <GridItem gridArea="footer" marginBottom={{ base: "30px", lg: "46px" }}>
        <Footer />
      </GridItem>
    </Grid>
  );
};
