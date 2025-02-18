import { PluginInitializerContext } from '../../../src/core/server';
import { IngestionControllerPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, OpenSearch Dashboards Platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new IngestionControllerPlugin(initializerContext);
}

export { IngestionControllerPluginSetup, IngestionControllerPluginStart } from './types';
