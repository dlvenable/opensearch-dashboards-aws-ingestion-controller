import React, { useState } from "react";
import { i18n } from '@osd/i18n';
import { FormattedMessage } from '@osd/i18n/react';

import {
  EuiBasicTable, EuiButton,
  EuiPage,
  EuiPageBody,
  EuiPageContent, EuiPageContentBody, EuiPageContentHeader,
  EuiPageHeader,
  EuiText,
  EuiTitle
} from "@elastic/eui";
import { Link } from "react-router-dom";
import { PLUGIN_NAME } from "../../common";
import { IngestionControllerAppDeps } from "./app";

export const IngestionIndex: React.FC<IngestionControllerAppDeps> = ({
  http,
  notifications
}) => {


  const [pipelines, setPipelines] = useState<IngestionPipeline[]>([]);


  const onClickHandler = () => {
    http.get('/api/ingestion_controller/pipelines').then((res) => {
      setPipelines(res.pipelines);
      // Use the core notifications service to display a success message.
      notifications.toasts.addSuccess(
        i18n.translate('ingestionController.dataUpdated', {
          defaultMessage: 'Data updated',
        })
      );
    });
  };


  const columns = [
    {field: 'pipelineName', name: 'PipelineName'},
    {field: 'status', name: 'Status'},
    {
      name: 'Details',
      render: (pipeline: IngestionPipeline) => (
        <Link to={`/pipelines/${pipeline.pipelineName}`}>View Details</Link>
      ),
    },
  ];

  // Render the application DOM.
  // Note that `navigation.ui.TopNavMenu` is a stateful component exported on the `navigation` plugin's start contract.
  return (

    <EuiPage restrictWidth="1000px">
      <EuiPageBody component="main">
        <EuiPageHeader>
          <EuiTitle size="l">
            <h1>
              <FormattedMessage
                id="ingestionController.helloWorldText"
                defaultMessage="{name}"
                values={{name: PLUGIN_NAME}}
              />
            </h1>
          </EuiTitle>
        </EuiPageHeader>
        <EuiPageContent>
          <EuiPageContentHeader>
            <EuiTitle>
              <h2>
                <FormattedMessage
                  id="ingestionController.congratulationsTitle"
                  defaultMessage="Welcome to the Ingestion OpenSearch Dashboards plugin!"
                />
              </h2>
            </EuiTitle>
          </EuiPageContentHeader>
          <EuiPageContentBody>
            <EuiText>
              <EuiTitle size="m">
                <h3>Pipelines</h3>
              </EuiTitle>
              <EuiButton type="primary" size="s" onClick={onClickHandler}>
                <FormattedMessage
                  id="ingestionController.buttonText"
                  defaultMessage="List Pipelines"
                />
              </EuiButton>
              <EuiBasicTable items={pipelines} columns={columns}/>
            </EuiText>
          </EuiPageContentBody>
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  );
};
