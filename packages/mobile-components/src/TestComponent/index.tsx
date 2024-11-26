import {type FC} from "react";
import { Text, View } from "react-native";

export const TestComponent: FC = () => (
    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
      <Text>Test component from shared library</Text>
    </View>
  )
