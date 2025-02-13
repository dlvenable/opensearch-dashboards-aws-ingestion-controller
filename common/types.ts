
interface IngestionPipeline {
  pipelineName: string;
  status: string;
}

/**
 * Information about a sink index in an ingestion pipeline.
 */
interface IngestionPipelineIndex {
  name: string;
}

/*
 * Details on pipeline components for an ingestion pipeline.
 * Components are things like sinks, sources, etc.
 */
interface IngestionPipelineComponents {
  indexes: IngestionPipelineIndex[];
  ingestionEndpointUrl?: string;
}

interface IngestionPipelineDetails {
  pipelineName: string;
  status: string;
  createdAt: string;
  lastUpdatedAt: string;
  ingestEndpointUrl: string;
  pipelineConfigurationBody: string;
}
