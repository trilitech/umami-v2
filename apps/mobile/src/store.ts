import { makeStore } from "@umami/state";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const store = makeStore(AsyncStorage);
