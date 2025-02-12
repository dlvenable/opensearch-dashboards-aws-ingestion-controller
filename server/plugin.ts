import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '../../../src/core/server';

import { IngestionControllerPluginSetup, IngestionControllerPluginStart } from './types';
import { defineRoutes } from './routes';

export class IngestionControllerPlugin
  implements Plugin<IngestionControllerPluginSetup, IngestionControllerPluginStart> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public setup(core: CoreSetup) {
    this.logger.debug('ingestion_controller: Setup');
    const router = core.http.createRouter();

    // Register server side APIs
    defineRoutes(router);

    return {};
  }

  public start(core: CoreStart) {
    this.logger.debug('ingestion_controller: Started');
    return {};
  }

  public stop() {}
}
