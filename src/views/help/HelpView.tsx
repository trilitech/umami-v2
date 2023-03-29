import { Flex, Grid, GridItem } from "@chakra-ui/layout";
import {
  Box,
  Card,
  CardBody,
  Text,
  Divider,
  Heading,
  Icon,
} from "@chakra-ui/react";
import { FiExternalLink } from "react-icons/fi";
import React from "react";
import { TopBar } from "../../components/TopBar";
import colors from "../../style/colors";
import CopyableText from "../../components/CopyableText";

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
      ml={5}
    >
      <GridItem area={"header"}>
        <TopBar title="Help" />
      </GridItem>
      <GridItem area={"main"} mt={1}>
        <HelpCard title="Learn More">
          <HelpLinkRow
            about="Browse Articles"
            link="https://medium.com/umamiwallet"
          />
        </HelpCard>

        <HelpCard title="Questions?">
          <HelpLinkRow
            about="Browse FAQs"
            link="https://gitlab.com/nomadic-labs/umami-wallet/umami/-/wikis/home#faq-support-knowledge-base"
          />
        </HelpCard>

        <HelpCard title="Need Help?">
          <Box>
            <Flex justifyContent="space-between" alignItems="center">
              <Heading size="sm">Contact our Support Team</Heading>
              <CopyableText
                displayText="umami-support@trili.tech"
                copyValue="umami-support@trili.tech"
                toastMessage="Email address copied to clipboard"
              />
            </Flex>

            <Box marginY={4}>
              <Divider orientation="horizontal" size="lg" />
            </Box>

            <HelpLinkRow
              about="Get in touch with the Community"
              link="https://join.slack.com/share/enQtNTAyODI3OTQ1NTU3MC02MGQxODkzMzA5NmUyYWE3YzMxM2ZlYjIyMGI2OGQ0OGZkODA1MzU3ZDViZTBjMDAyNWIwNDBlNjBhMjFkOWU1"
              linkDescription="Slack #Umami"
            />
          </Box>
        </HelpCard>

        <HelpCard title="Terms of Use">
          <HelpLinkRow
            about="Read Terms of Service"
            link="https://umamiwallet.com/tos.html"
          />
        </HelpCard>
      </GridItem>
    </Grid>
  );
}

const HelpLinkRow: React.FC<{
  about: string;
  link: string;
  linkDescription?: string;
}> = ({ about, link, linkDescription }) => {
  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Heading size="sm">{about}</Heading>

      <Flex alignItems="center">
        {linkDescription && (
          <Text size="sm" color={colors.gray[300]}>
            {linkDescription}
          </Text>
        )}
        <Icon
          cursor="pointer"
          color={colors.gray[600]}
          as={FiExternalLink}
          _hover={{
            color: colors.gray[300],
          }}
          onClick={() => {
            window.open(link, "_blank");
          }}
          ml={2}
        />
      </Flex>
    </Flex>
  );
};

const HelpCard: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <Box marginY={2}>
      <Flex>
        <Box w="550px">
          <Heading size="lg">{title}</Heading>
          <Card
            paddingX={1}
            marginY={2}
            bgColor={colors.gray[900]}
            borderRadius="lg"
            justifyContent="center"
            border="1px solid"
            borderColor={colors.gray[700]}
          >
            <CardBody>{children}</CardBody>
          </Card>
        </Box>
      </Flex>
    </Box>
  );
};
