import React from 'react';
import { I18nProvider } from '@osd/i18n/react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { CoreStart } from '../../../../src/core/public';
import { NavigationPublicPluginStart } from '../../../../src/plugins/navigation/public';

import { PLUGIN_ID } from '../../common';
import { IngestionIndex } from "./index";
import { PipelinePage } from "./pipeline";

export interface IngestionControllerAppDeps {
  basename: string;
  notifications: CoreStart['notifications'];
  http: CoreStart['http'];
  navigation: NavigationPublicPluginStart;
}


export const IngestionControllerApp = ({
  basename,
  notifications,
  http,
  navigation,
}: IngestionControllerAppDeps) => {

  // Render the application DOM.
  // Note that `navigation.ui.TopNavMenu` is a stateful component exported on the `navigation` plugin's start contract.
  return (
    <Router basename={basename}>
      <I18nProvider>
        <>
          <navigation.ui.TopNavMenu
            appName={PLUGIN_ID}
            showSearchBar={true}
            useDefaultBehaviors={true}
          />
        </>
      </I18nProvider>
      <Switch>
        <Route path={['/pipelines/:pipelineName']}>
          <PipelinePage
            basename={basename}
            http={http}
            notifications={notifications}
            navigation={navigation}
          />
        </Route>
        <Route path={['/']}>
          <IngestionIndex
            basename={basename}
            http={http}
            notifications={notifications}
            navigation={navigation}
          />
        </Route>
      </Switch>
    </Router>
  );
};
