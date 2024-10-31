import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeStore } from "@umami/state";

export const store = makeStore(AsyncStorage);
