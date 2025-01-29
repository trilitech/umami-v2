import { type SocialAccount } from "@umami/core";
import { useCurrentAccount, useGetAccountBalance } from "@umami/state";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "tamagui";

import { useSocialOnboarding } from "../../services/auth";

export default function Home() {
  const currentAccount = useCurrentAccount();
  const getBalance = useGetAccountBalance();
  const { logout } = useSocialOnboarding();
  const balance = getBalance(currentAccount ? currentAccount.address.pkh : "");

  return (
    <View style={styles.container}>
      <Text style={{fontSize: 12}}>Balance</Text>
      <Text style={{marginTop: 5, fontWeight: "bold", fontSize: 18}}>{balance ?? "$0.00"}</Text>
      <View style={{flexDirection: "row", justifyContent: "space-around", width: "100%", marginVertical: 20}}>
        <View style={{alignItems: "center"}}>
        <View style={{backgroundColor: "#E1E1EF", width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center"}}>

          </View>
          <Text>Buy</Text>
        </View>
        <View style={{alignItems: "center"}}>
          <View style={{backgroundColor: "#E1E1EF", width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center"}}>

          </View>
          <Text>Swap</Text>
        </View>
        <View style={{alignItems: "center"}}>
          <View style={{backgroundColor: "#E1E1EF", width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center"}}>

          </View>
          <Text>Receive</Text>
        </View>
        <View style={{alignItems: "center"}}>
          <View style={{backgroundColor: "#E1E1EF", width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center"}}>

          </View>
          <Text>Send</Text>
        </View>
      </View>
      <View style={{marginTop: 50}}>
      <Text>Address: {currentAccount?.address.pkh}</Text>
      <Text>Label: {currentAccount?.label}</Text>
      <Button onPress={() => logout((currentAccount as SocialAccount).idp)}>
        <Button.Text>Logout</Button.Text>
      </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
});
