
import { Text } from "@chakra-ui/react"
import { SettingsStore, web3wallet } from "@umami/state"
import { type PairingTypes } from "@walletconnect/types"
import { getSdkError } from "@walletconnect/utils"
import { Fragment, useEffect } from "react"
import { useSnapshot } from "valtio"

import PairingCard from "./PairingCard"

export default function PairingsPage() {
  const { pairings } = useSnapshot(SettingsStore.state)
  // const [walletPairings ] = useState(web3wallet.core.pairing.getPairings())

  async function onDelete(topic: string) {
    await web3wallet.disconnectSession({ topic, reason: getSdkError("USER_DISCONNECTED") })
    const newPairings = pairings.filter(pairing => pairing.topic !== topic)
    SettingsStore.setPairings(newPairings as PairingTypes.Struct[])
  }

  useEffect(() => {
    SettingsStore.setPairings(web3wallet.core.pairing.getPairings())
  }, [])

  // console.log("pairings", walletPairings)
  return (
    <Fragment>
      {pairings.length ? (
        pairings.map(pairing => {
          const { peerMetadata } = pairing

          return (
            <PairingCard
              key={pairing.topic}
              data-testid={"pairing-" + pairing.topic}
              logo={peerMetadata?.icons[0]}
              name={peerMetadata?.name}
              onDelete={() => onDelete(pairing.topic)}
              topic={pairing.topic}
              url={peerMetadata?.url}
            />
          )
        })
      ) : (
        <Text css={{ opacity: "0.5", textAlign: "center", marginTop: "$20" }}>No pairings</Text>
      )}
    </Fragment>
  )
}
