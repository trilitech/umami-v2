import { Text, View } from "react-native"

export const HeaderComponent: React.FC = () => (
    <View style={{width: "100%", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
      <View style={{backgroundColor: "#E1E1EF", borderRadius: 100, alignItems: "center", justifyContent: "center", paddingVertical: 6, paddingHorizontal:10, flexDirection: "row"}}>
        <View style={{width: 24, height: 24, borderRadius: 12, backgroundColor: "white", marginRight: 5}} />
        <Text>Account</Text>
      </View>
      <View style={{flexDirection: "row", justifyContent: "space-between", width: "35%"}}>
        <View style={{backgroundColor: "#E1E1EF", width: 30, height: 30, borderRadius: 15, justifyContent: "center", alignItems: "center"}}>

        </View>
        <View style={{backgroundColor: "#E1E1EF", width: 30, height: 30, borderRadius: 15, justifyContent: "center", alignItems: "center"}}>

        </View>
        <View style={{backgroundColor: "#E1E1EF", width: 30, height: 30, borderRadius: 15, justifyContent: "center", alignItems: "center"}}>

        </View>
      </View>

    </View>
  )
