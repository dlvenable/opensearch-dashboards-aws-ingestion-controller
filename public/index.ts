import './index.scss';

import { IngestionControllerPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, OpenSearch Dashboards Platform `plugin()` initializer.
export function plugin() {
  return new IngestionControllerPlugin();
}
export { IngestionControllerPluginSetup, IngestionControllerPluginStart } from './types';
