# ingestion_controller

An OpenSearch Dashboards plugin for interacting with Amazon OpenSearch Ingestion pipelines.

This project is in a development/demo state.

---

## Development

Because this project is in development, I have only tested it by building it as part of the `OpenSearch-Dashboards` project.

```
git clone git@github.com:opensearch-project/OpenSearch-Dashboards.git
cd OpenSearch-Dashboards
cd plugins
git clone git@github.com:dlvenable/opensearch-dashboards-aws-ingestion-controller.git ingestion_controller
cd ..
```

The initial work was done against [57e1d27](https://github.com/opensearch-project/OpenSearch-Dashboards/tree/57e1d27faddbf340205afa98dac25882a7d85e29).
If there are compatibility issues, try against that commit.

Now build the OpenSearch-Dashboards project.


See the [OpenSearch Dashboards contributing guide](https://github.com/opensearch-project/OpenSearch-Dashboards/blob/main/CONTRIBUTING.md) 
for instructions setting up your development environment.

    ## Scripts
    <dl>
      <dt><code>yarn osd bootstrap</code></dt>
      <dd>Execute this to install node_modules and setup the dependencies in your plugin and in OpenSearch Dashboards
      </dd>

      <dt><code>yarn plugin-helpers build</code></dt>
      <dd>Execute this to create a distributable version of this plugin that can be installed in OpenSearch Dashboards
      </dd>
    </dl>

Before running the project, you must configure your AWS credentials.

```
export AWS_PROFILE=<profile>
export AWS_REGION<profile>
```

