import React, { useEffect, useState } from "react";
import { i18n } from '@osd/i18n';
import { FormattedMessage } from '@osd/i18n/react';

import {
  EuiHorizontalRule,
  EuiPage,
  EuiPageBody,
  EuiPageContent, EuiPageContentBody, EuiPageHeader,
  EuiText,
  EuiTitle
} from "@elastic/eui";
import { useParams } from "react-router-dom";
import { IngestionControllerAppDeps } from "./app";

export const PipelinePage: React.FC<IngestionControllerAppDeps> = ({
  http,
  notifications
}) => {

  const {pipelineName} = useParams<{ pipelineName: string }>();

  const [pipeline, setPipeline] = useState<IngestionPipelineDetails | undefined>();

  useEffect(() => {
    const getPipeline = async () => {
      http.get(`/api/ingestion_controller/pipelines/${pipelineName}`).then((res) => {
        setPipeline(res.pipeline);
        // Use the core notifications service to display a success message.
        notifications.toasts.addSuccess(
          i18n.translate('ingestionController.getPipeline', {
            defaultMessage: 'Data updated',
          })
        );
      })
        .catch(() => {
          notifications.toasts.addDanger(
            i18n.translate('ingestionController.getPipeline', {
              defaultMessage: 'Failed to update',
            })
          );
        });
    };

      getPipeline();
    }, [] );


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
                    values={{name: pipelineName}}
                  />
                </h1>
              </EuiTitle>
            </EuiPageHeader>
            <EuiPageContent>
              <EuiPageContentBody>
                <EuiText>
                  <p>
                    <FormattedMessage
                      id="ingestionController.nameText"
                      defaultMessage="Pipeline Name: {name}"
                      values={{name: pipelineName ? pipelineName : 'No name'}}
                    />
                  </p>
                  <p>
                    <FormattedMessage
                      id="ingestionController.statusText"
                      defaultMessage="Status: {status}"
                      values={{status: pipeline ? pipeline.status : 'No status'}}
                    />
                  </p>
                  <p>
                    <FormattedMessage
                      id="ingestionController.statusText"
                      defaultMessage="Created time: {created} / Last updated time: {updated}"
                      values={{
                        created: pipeline ? pipeline.createdAt : 'No info',
                        updated: pipeline ? pipeline.lastUpdatedAt : 'No info',
                    }}
                    />
                  </p>
                  <EuiHorizontalRule/>
                </EuiText>
              </EuiPageContentBody>
            </EuiPageContent>
          </EuiPageBody>
        </EuiPage>
      );
    };
