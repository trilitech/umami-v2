import { AspectRatio, Flex, Heading, Image, Link, Tooltip } from "@chakra-ui/react";
import { Operation } from "../../types/Operation";
import { useGetToken } from "../../utils/hooks/tokensHooks";
import { prettyTezAmount } from "../../utils/format";
import colors from "../../style/colors";
import { getIPFSurl } from "../../utils/token/nftUtils";
import { thumbnailUri, tokenNameSafe, tokenUri } from "../../types/Token";
import { tokenTitle } from "./BatchView";
import { useSelectedNetwork } from "../../utils/hooks/networkHooks";

export const OperationView = ({ operation }: { operation: Operation }) => {
  const getToken = useGetToken();
  const network = useSelectedNetwork();

  switch (operation.type) {
    case "tez":
      return (
        <Flex>
          <Heading size="sm">{prettyTezAmount(operation.amount)}</Heading>
        </Flex>
      );
    case "fa1.2":
    case "fa2": {
      const token = getToken(operation.contract.pkh, operation.tokenId);
      if (token?.type === "nft") {
        return (
          <Flex>
            {Number(operation.amount) > 1 && (
              <>
                <Heading size="sm" color={colors.gray[450]}>
                  x{operation.amount}
                </Heading>
                &nbsp;
              </>
            )}
            <Heading size="sm">
              <Tooltip
                bg={colors.gray[700]}
                border="1px solid"
                borderColor={colors.gray[500]}
                borderRadius="8px"
                p="8px"
                label={
                  <AspectRatio w="170px" h="170px" ratio={1}>
                    <Image src={getIPFSurl(thumbnailUri(token))} />
                  </AspectRatio>
                }
              >
                <Link data-testid="link" href={tokenUri(token, network)}>
                  {tokenNameSafe(token)}
                </Link>
              </Tooltip>
            </Heading>
          </Flex>
        );
      }

      return (
        <Flex>
          <Heading size="sm">
            <Link data-testid="link" href={token ? tokenUri(token, network) : undefined}>
              {tokenTitle(token, operation.amount)}
            </Link>
          </Heading>
        </Flex>
      );
    }
    case "delegation":
      return (
        <Flex>
          <Heading size="sm">Delegate</Heading>
        </Flex>
      );
    case "undelegation":
      return (
        <Flex>
          <Heading size="sm">End Delegation</Heading>
        </Flex>
      );
    case "contract_origination":
    case "contract_call":
      throw new Error(`${operation.type} is not suported yet`);
  }
};
