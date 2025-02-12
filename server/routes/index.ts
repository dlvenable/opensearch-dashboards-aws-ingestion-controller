import { IRouter } from '../../../../src/core/server';
import { schema } from "@osd/config-schema";
import { GetPipelineCommand, ListPipelinesCommand, OSISClient } from "@aws-sdk/client-osis";

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

  async function getPipeline(pipelineName: string) {
    const getCommand = new GetPipelineCommand({PipelineName: pipelineName});

    try {
      const response = await client.send(getCommand);

      const pipeline = response.Pipeline || {};
      return {
        pipelineName: pipeline.PipelineName,
        status: pipeline.Status,
        lastUpdatedAt: pipeline.LastUpdatedAt?.toISOString(),
        createdAt: pipeline.CreatedAt?.toISOString()
      } as IngestionPipelineDetails

    } catch (error) {
      console.error("Error getting pipeline:", error);
      throw error;
    }
  }

  router.get(
    {
      path: '/api/ingestion_controller/pipelines_static',
      validate: false,
    },
    async (context, request, response) => {
      return response.ok({
        body: {
          pipelines: [
            {
              pipelineName: 'pipeline1',
              status: 'ACTIVE',
            },
            {
              pipelineName: 'pipeline2',
              status: 'ACTIVE',
            },
            {
              pipelineName: 'pipeline3',
              status: 'ACTIVE',
            },
          ]
        },
      });
    }
  );

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
        const pipeline = await getPipeline(request.params.pipelineName)
        return response.ok({
          body: {
            pipeline: pipeline
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

  router.get(
    {
      path: '/api/ingestion_controller/pipelines_static/{pipelineName}',
      validate: {
        params: schema.object({
          pipelineName: schema.string(),
        }),
      },
    },
    async (context, request, response) => {
      if(request.params.pipelineName === 'pipeline1') {
        return response.ok({
          body: {
            pipeline: {
              pipelineName: 'pipeline1',
              status: 'ACTIVE',
              createdAt: '2024-01-01T00:00:00.000Z',
              lastUpdatedAt: '2025-01-01T00:00:00.000Z',
            }
          },
        });
      } else if(request.params.pipelineName == 'pipeline2') {
        return response.ok({
          body: {
            pipeline: {
              pipelineName: 'pipeline2',
              status: 'CREATING',
              createdAt: '2024-01-01T00:00:00.000Z',
              lastUpdatedAt: '2025-01-01T00:00:00.000Z',
            }
          },
        });
      } else {
        return response.notFound()
      }

    }
  );
}
