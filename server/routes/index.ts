import { IRouter } from '../../../../src/core/server';
import { schema } from "@osd/config-schema";
import { GetPipelineCommand, ListPipelinesCommand, OSISClient } from "@aws-sdk/client-osis";

import * as yaml from 'js-yaml';
import { JSONPath } from 'jsonpath-plus';

export function defineRoutes(router: IRouter) {
  const client = new OSISClient({});

  async function listPipelines() {
    const listCommand = new ListPipelinesCommand({});

    try {
      const listResponse = await client.send(listCommand);

      const pipelines = listResponse.Pipelines?.map(pipeline => ({
        pipelineName: pipeline.PipelineName,
        status: pipeline.Status
      })).map(p => (p as IngestionPipeline)) || [];

      console.log(pipelines)

      return pipelines;

    } catch (error) {
      console.error("Error listing pipelines:", error);
      throw error;
    }
  }

  router.get(
    {
      path: '/api/ingestion_controller/pipelines',
      validate: false,
    },
    async (context, request, response) => {
      try {
        const pipelines = await listPipelines()
        return response.ok({
          body: {
            pipelines: pipelines
          },
        });
      } catch (error) {
        return response.internalError({
          body: {
            attributes: {
              title: error.name,
            },
            message: error.message,
          },
        });
      }
    }
  );

  /**
   * Gets a pipeline from OSIS.
   *
   * @param pipelineName The name of the pipeline to get.
   * @returns The pipeline details.
   */
  async function getPipeline(pipelineName: string) {
    const getCommand = new GetPipelineCommand({PipelineName: pipelineName});

    try {
      const response = await client.send(getCommand);

      const pipeline = response.Pipeline || {};
      return {
        pipelineName: pipeline.PipelineName,
        status: pipeline.Status,
        lastUpdatedAt: pipeline.LastUpdatedAt?.toISOString(),
        createdAt: pipeline.CreatedAt?.toISOString(),
        ingestEndpointUrl: pipeline.IngestEndpointUrls ? (pipeline.IngestEndpointUrls.length == 1 ? pipeline.IngestEndpointUrls[0] : null) : null,
        pipelineConfigurationBody: pipeline.PipelineConfigurationBody
      } as IngestionPipelineDetails

    } catch (error) {
      console.error("Error getting pipeline:", error);
      throw error;
    }
  }

  /**
   * Parses the pipeline configuration body to understand information such as
   * the indexes.
   *
   * @param pipelineConfigurationBody The pipeline configuration body (the YAML) from the pipeline
   * @returns An object of {@link IngestionPipelineComponents containing the indexes information.
   */
  function understandPipeline(pipeline: IngestionPipelineDetails) : IngestionPipelineComponents {
    const pipelineConfigurationBody = pipeline.pipelineConfigurationBody;
    const yamlBody = yaml.load(pipelineConfigurationBody);

    const indexes: string[] = JSONPath({ path: '$.*.sink[*].opensearch.index', json: yamlBody });

    const indexesInformation = indexes.map(index => ({
      name: index
    }))
      .map(index => (index as IngestionPipelineIndex));

    let ingestionEndpointUrl = null;
    if(pipeline.ingestEndpointUrl != null) {
      let resolvedPaths: string[] = [];

      // Iterate through all top-level keys (potential pipeline names)
      for (const pipelineName of Object.keys(yamlBody)) {
        if(pipelineName == 'version') continue;

        const sourcePaths: string[] = JSONPath({ path: `$.${pipelineName}.source.*.path`, json: yamlBody });
        if(sourcePaths.length == 0)
          continue;

        const resolvedPath = sourcePaths[0].replace('${pipelineName}', pipelineName);

        if (indexes.length > 0) {
          resolvedPaths.push(resolvedPath);
        }
      }
      //const sourcePaths: string[] = JSONPath({ path: '$.*.source.*.path', json: yamlBody });

      if(resolvedPaths.length > 0) {
        ingestionEndpointUrl = pipeline.ingestEndpointUrl + resolvedPaths[0];
      }


    }

    return {
      indexes: indexesInformation,
      ingestionEndpointUrl: ingestionEndpointUrl
    }
  }

  router.get(
    {
      path: '/api/ingestion_controller/pipelines/{pipelineName}',
      validate: {
        params: schema.object({
          pipelineName: schema.string(),
        }),
      },
    },
    async (context, request, response) => {
      try {
        const pipeline = await getPipeline(request.params.pipelineName);
        const ingestionPipelineComponents = understandPipeline(pipeline);
        return response.ok({
          body: {
            pipeline: pipeline,
            components: ingestionPipelineComponents
          },
        });
      } catch (error) {
        return response.internalError({
          body: {
            attributes: {
              title: error.name,
            },
            message: error.message,
          },
        });
      }

    }
  );
}
