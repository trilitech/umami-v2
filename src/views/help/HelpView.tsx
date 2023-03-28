import { Flex, Grid, GridItem } from "@chakra-ui/layout";
import { Box, Card, CardBody, Heading, Icon } from "@chakra-ui/react";
import { FiExternalLink } from "react-icons/fi";
import { MdLink } from "react-icons/md";
import { TopBar } from "../../components/TopBar";
import colors from "../../style/colors";

export default function HelpView() {
  return (
    <Grid
      h="100%"
      templateAreas={`
                  "header header"
                  "main main"
                  "main main"
                  `}
      gridTemplateRows={"0fr 1fr 1fr"}
      gridTemplateColumns={"1fr 1fr"}
      gap="1"
    >
      <GridItem area={"header"}>
        <TopBar title="Help" />
      </GridItem>
      <GridItem area={"main"}>
        <Box marginY={5}>
          <Flex>
            <Box w="550px">
              <Heading size="lg">Learn More</Heading>
              <Card
                h="66px"
                p={5}
                marginY={5}
                bgColor={colors.gray[900]}
                borderRadius="8px"
                justifyContent="center"
                border="1px solid"
                borderColor={colors.gray[700]}
              >
                <CardBody>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Heading size="sm">Browse Articles</Heading>

                    <Icon
                      cursor="pointer"
                      onClick={(_) => {}}
                      color={colors.gray[400]}
                      as={FiExternalLink}
                    />
                  </Flex>
                </CardBody>
              </Card>
            </Box>
          </Flex>
        </Box>

        <Box marginY={5}>
          <Flex>
            <Box w="550px">
              <Heading size="lg">Questions?</Heading>
              <Card
                h="66px"
                p={5}
                marginY={5}
                bgColor={colors.gray[900]}
                borderRadius="8px"
                justifyContent="center"
                border="1px solid"
                borderColor={colors.gray[700]}
              >
                <CardBody>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Heading size="sm">Browse FAQs</Heading>

                    <Icon
                      cursor="pointer"
                      onClick={(_) => {}}
                      color={colors.gray[400]}
                      as={FiExternalLink}
                    />
                  </Flex>
                </CardBody>
              </Card>
            </Box>
          </Flex>
        </Box>

        <Box marginY={5}>
          <Flex>
            <Box w="550px">
              <Heading size="lg">Terms of Use</Heading>
              <Card
                h="66px"
                p={5}
                marginY={5}
                bgColor={colors.gray[900]}
                borderRadius="lg"
                justifyContent="center"
                border="1px solid"
                borderColor={colors.gray[700]}
              >
                <CardBody>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Heading size="sm">Read Terms of Service</Heading>

                    <Icon
                      cursor="pointer"
                      onClick={(_) => {}}
                      color={colors.gray[400]}
                      as={FiExternalLink}
                    />
                  </Flex>
                </CardBody>
              </Card>
            </Box>
          </Flex>
        </Box>
      </GridItem>
    </Grid>
  );
}
