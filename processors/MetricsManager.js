// Imports the Google Cloud client library
const monitoring = require('@google-cloud/monitoring');

// Creates a client
const client = new monitoring.MetricServiceClient();


//  OpenCensus
const { TagMap, globalStats, MeasureUnit, AggregationType } = require('@opencensus/core');
const { StackdriverStatsExporter } = require('@opencensus/exporter-stackdriver');

class MetricsManager {
  //keyFilename
  constructor(config) {
    this.projectId = config.projectId;
  }


  async opencensusTargetLanguage(target_language) {
    'use strict';
    //const exporter = new StackdriverTraceExporter({projectId: this.projectId});
    //tracing.registerExporter(exporter).start();
    try {

      const EXPORT_INTERVAL = 60;
      const MEASURE_REQUEST_COUNT = globalStats.createMeasureInt64(
        'https://custom.googleapis.com/michaelchi_demo/translation',
        MeasureUnit.UNIT,
        'Custom Translation Requests'
      );
      console.log(`[Info]Target Language ${target_language}`);
      var tags = new TagMap();
      tags.set('demo_target_language', { value: target_language });

      // Register the view. It is imperative that this step exists,
      // otherwise recorded metrics will be dropped and never exported.
      const view = globalStats.createView(
        'demo_target_language',
        MEASURE_REQUEST_COUNT,
        AggregationType.SUM,
        [{ name: 'demo_target_language' }],
        'Dialogflow Requested translation target language'
      );

      // Then finally register the views
      globalStats.registerView(view);

      // Enable OpenCensus exporters to export metrics to Stackdriver Monitoring.
      // Exporters use Application Default Credentials (ADCs) to authenticate.
      // See https://developers.google.com/identity/protocols/application-default-credentials
      // for more details.
      // Expects ADCs to be provided through the environment as ${GOOGLE_APPLICATION_CREDENTIALS}
      // A Stackdriver workspace is required and provided through the environment as ${GOOGLE_PROJECT_ID}

      // The minimum reporting period for Stackdriver is 1 minute.
      const exporter = new StackdriverStatsExporter({
        projectId: this.projectId,
        period: EXPORT_INTERVAL * 1000,
      });

      // Pass the created exporter to Stats
      globalStats.registerExporter(exporter);

      //container_name namespace_name
      //tags.set('container_name','fulfillment');
      //tags.set('namespace_name','default');
      globalStats.record([
        {
          measure: MEASURE_REQUEST_COUNT,
          value: 1,
        },
      ],
        tags
      );


    } catch (ex) {
      console.error(`[ERROR]${ex}`);
    }
  }

  async createTargetLanguageMetric() {
    try {
      const request = {
        name: client.projectPath(this.projectId),
        metricDescriptor: {
          description: 'Translation Target Language',
          displayName: 'Target Language',
          type: 'custom.googleapis.com/translation/target_language',
          metricKind: 'GAUGE',
          valueType: 'INT64',
          unit: '{Request}',
          labels: [
            {
              key: 'target_language',
              valueType: 'STRING',
              description: 'Target Language of ßthis translation request.',
            },
          ],
        },
      };
      ß
    } catch (ex) {
      console.log(`Exception: ${ex}`);
    }
  }
  async targetLanguage(target_language) {
    // Imports the Google Cloud client library
    const monitoring = require('@google-cloud/monitoring');

    // Creates a client
    const client = new monitoring.MetricServiceClient();

    const dataPoint = {
      interval: {
        endTime: {
          seconds: Date.now() / 1000,
        },
      },
      value: {
        int64Value: 1,
        doubleValue: 1
      },
    };

    const timeSeriesData = {
      metric: {
        type: 'custom.googleapis.com/translation/target_language',
        labels: {
          target_language: target_language,
        },
      },
      resource: {
        type: 'global',
        labels: {
          project_id: this.projectId,
        },
      },
      points: [dataPoint],
    };

    const request = {
      name: client.projectPath(this.projectId),
      timeSeries: [timeSeriesData],
    };

    // Writes time series data
    try {
      const result = await client.createTimeSeries(request);
      console.log(`Done writing time series data.`, result);
    } catch (ex) {
      //  To address this error : 3 INVALID_ARGUMENT: One or more TimeSeries could not be written: One or more points were written more frequently th
      //                          an the maximum sampling period configured for the metric. {Metric: custom.googleapis.com/translation/target_language
      console.log(`error ingesting metric: ${ex}`);
    }
  }
}
module.exports = MetricsManager;