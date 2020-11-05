import { registerRootComponent } from 'expo';
import { name as appName } from "./app.json";
import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
// registerRootComponent(App);
console.log("sdsd")
if (Platform.OS == "android") {
  registerRootComponent(App);
} else {
  AppRegistry.registerComponent(appName, () => App);
}
