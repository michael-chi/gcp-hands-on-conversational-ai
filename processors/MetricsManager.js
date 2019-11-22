// Imports the Google Cloud client library
const monitoring = require('@google-cloud/monitoring');

// Creates a client
const client = new monitoring.MetricServiceClient();

class MetricsManager {
    //keyFilename
    constructor(config) { 
        this.projectId = config.projectId;
    }
    async createTargetLanguageMetric() {
        try
        {
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
        }catch(ex){
            console.log(`Exception: ${ex}`);
        }
    }
    async targetLanguage(target_language){
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
          try
          {
            const result = await client.createTimeSeries(request);
            console.log(`Done writing time series data.`, result);
          }catch(ex){
            //  To address this error : 3 INVALID_ARGUMENT: One or more TimeSeries could not be written: One or more points were written more frequently th
            //                          an the maximum sampling period configured for the metric. {Metric: custom.googleapis.com/translation/target_language
            console.log(`error ingesting metric: ${ex}`);
          }
    }
}
module.exports = MetricsManager;