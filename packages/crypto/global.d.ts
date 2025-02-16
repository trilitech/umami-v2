import { AsyncStorageStatic } from "@react-native-async-storage/async-storage";

declare global {
  var AsyncStorage: AsyncStorageStatic;
}
