
import { Button, Card, CardBody, Link, Text, Tooltip } from "@chakra-ui/react"
import { truncate } from "@umami/tezos"

import { CrossedCircleIcon } from "../../../assets/icons"

/**
 * Types
 */
interface IProps {
  name?: string
  url?: string
  topic?: string
  onDelete: () => Promise<void>
}

/**
 * Component
 */
export default function PairingCard({ name, url, topic, onDelete }: IProps) {
  return (
    <Card className="relative mb-6 min-h-[70px] border border-light">
      <CardBody className="flex flex-row items-center justify-between overflow-hidden p-4">
        <div className="flex-1">
          <Text className="ml-9" data-testid={"pairing-text-" + topic}>
            {name}
          </Text>
          <Link className="ml-9" data-testid={"pairing-text-" + topic} href={url}>
              {truncate(url?.split("https://")[1] ?? "Unknown", 23)}
          </Link>
        </div>
        <Tooltip content="Delete" placement="left">
          <Button className="min-w-auto text-error border-0 p-1 hover:bg-red-100 transition-all"
            data-testid={"pairing-delete-" + topic}
            onClick={onDelete}
          >
            <CrossedCircleIcon alt="delete icon" />
          </Button>
        </Tooltip>
      </CardBody>
    </Card>
  )
}
