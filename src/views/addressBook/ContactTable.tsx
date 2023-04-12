import {
  Button,
  Divider,
  Flex,
  Icon,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Text,
  Tr,
} from "@chakra-ui/react";
import { IconAndTextBtn } from "../../components/IconAndTextBtn";
import colors from "../../style/colors";
import { Contact } from "../../types/Contact";
import { CopyableAddress } from "../../components/CopyableText";
import { MdArrowOutward } from "react-icons/md";
import { BsThreeDots, BsTrash } from "react-icons/bs";
import { BiPencil } from "react-icons/bi";

const PopoverThreeDots: React.FC = () => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="unstyled">
          <Icon
            as={BsThreeDots}
            color={colors.gray[600]}
            _hover={{
              color: colors.gray[300],
            }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent w="100px" bg={colors.gray[900]}>
        <PopoverBody borderRadius="lg">
          <Flex alignItems="center">
            <Text size="sm" mr={1}>
              Rename
            </Text>
            <Icon
              as={BiPencil}
              color={colors.gray[600]}
              _hover={{
                color: colors.gray[300],
              }}
            />
          </Flex>
          <Divider marginY={1} />
          <Flex alignItems="center">
            <Text size="sm" mr={1}>
              Remove
            </Text>
            <Icon
              as={BsTrash}
              color={colors.gray[600]}
              _hover={{
                color: colors.gray[300],
              }}
            />
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

const ContactTable: React.FC<{ contacts: Contact[] }> = ({ contacts }) => {
  return (
    <TableContainer overflowX="unset" overflowY="unset">
      <Table>
        <Thead
          position="sticky"
          top={0}
          zIndex="docked"
          bg="umami.gray.900"
          borderRadius={4}
        >
          <Tr>
            <Th>Name:</Th>
            <Th>Address:</Th>
          </Tr>
        </Thead>
        <Tbody>
          {contacts.map((contact) => {
            return (
              <Tr key={contact.pkh}>
                <Td>{contact.name}</Td>
                <Td>
                  <Flex alignItems="center" justifyContent="space-between">
                    <Flex alignItems="center">
                      <CopyableAddress
                        width="330px"
                        mr={4}
                        justifyContent="space-between"
                        pkh={contact.pkh}
                        formatAddress={false}
                      />
                      <IconAndTextBtn icon={MdArrowOutward} label="Send" />
                    </Flex>
                    <PopoverThreeDots />
                  </Flex>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default ContactTable;
