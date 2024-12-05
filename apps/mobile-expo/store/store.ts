import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeStore } from "@umami/state";
import { persistStore } from "redux-persist";

const store = makeStore(AsyncStorage);
export const persistor = persistStore(store);

export default store;
