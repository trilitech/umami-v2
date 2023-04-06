import { Flex, Grid, GridItem } from "@chakra-ui/layout";
import { Box, Text, Divider, Heading, Icon } from "@chakra-ui/react";
import { FiExternalLink } from "react-icons/fi";
import React from "react";
import { TopBar } from "../../components/TopBar";
import colors from "../../style/colors";
import CopyableText from "../../components/CopyableText";
import ClickableCard from "../../components/ClickableCard";

export default function HelpView() {
  const jumpToLink = (link: string) => {
    window.open(link, "_blank");
  };
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
      <GridItem area={"main"} mt={1}>
        <HelpCard
          title="Learn More"
          pointsOnHover
          onClick={() => {
            jumpToLink("https://medium.com/umamiwallet");
          }}
        >
          <HelpLinkRow
            about="Browse Articles"
            onClickIcon={() => {
              jumpToLink("https://medium.com/umamiwallet");
            }}
          />
        </HelpCard>

        <HelpCard
          title="Questions?"
          pointsOnHover
          onClick={() => {
            jumpToLink(
              "https://gitlab.com/nomadic-labs/umami-wallet/umami/-/wikis/home#faq-support-knowledge-base"
            );
          }}
        >
          <HelpLinkRow
            about="Browse FAQs"
            onClickIcon={() => {
              jumpToLink(
                "https://gitlab.com/nomadic-labs/umami-wallet/umami/-/wikis/home#faq-support-knowledge-base"
              );
            }}
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
              onClickIcon={() => {
                jumpToLink(
                  "https://join.slack.com/share/enQtNTAyODI3OTQ1NTU3MC02MGQxODkzMzA5NmUyYWE3YzMxM2ZlYjIyMGI2OGQ0OGZkODA1MzU3ZDViZTBjMDAyNWIwNDBlNjBhMjFkOWU1"
                );
              }}
              linkDescription="Slack #Umami"
            />
          </Box>
        </HelpCard>

        <HelpCard
          title="Terms of Use"
          pointsOnHover
          onClick={() => {
            jumpToLink("https://umamiwallet.com/tos.html");
          }}
        >
          <HelpLinkRow
            about="Read Terms of Service"
            onClickIcon={() => {
              jumpToLink("https://umamiwallet.com/tos.html");
            }}
          />
        </HelpCard>
      </GridItem>
    </Grid>
  );
}

const HelpLinkRow: React.FC<{
  about: string;
  onClickIcon: () => void;
  linkDescription?: string;
}> = ({ about, onClickIcon, linkDescription }) => {
  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Heading size="sm">{about}</Heading>

      <Flex alignItems="center">
        {linkDescription && (
          <Text
            size="sm"
            color={colors.gray[400]}
            _hover={{
              color: colors.gray[100],
              cursor: "pointer",
            }}
            onClick={onClickIcon}
          >
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
          onClick={onClickIcon}
          ml={2}
        />
      </Flex>
    </Flex>
  );
};

const HelpCard: React.FC<{
  title: string;
  pointsOnHover?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}> = ({ title, pointsOnHover = false, onClick, children }) => {
  return (
    <Box marginY={2}>
      <Flex>
        <Box w="550px">
          <Heading size="lg">{title}</Heading>
          <ClickableCard onClick={onClick}>{children}</ClickableCard>
        </Box>
      </Flex>
    </Box>
  );
};
