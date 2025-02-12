import { NavigationPublicPluginStart } from '../../../src/plugins/navigation/public';

export interface IngestionControllerPluginSetup {
  getGreeting: () => string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IngestionControllerPluginStart {}

export interface AppPluginStartDependencies {
  navigation: NavigationPublicPluginStart;
}
