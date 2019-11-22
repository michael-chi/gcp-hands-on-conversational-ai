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
        const request = {
            name: client.projectPath(this.projectId),
            metricDescriptor: {
              description: 'Translation Target Language',
              displayName: 'Target Language',
              type: 'custom.googleapis.com/translation/target_language',
              metricKind: 'GAUGE',
              valueType: 'DOUBLE',
              unit: '{Request}',
              labels: [
                {
                  key: 'target_language',
                  valueType: 'STRING',
                  description: 'Target Language of this translation request.',
                },
              ],
            },
          };
          const [descriptor] = await client.createMetricDescriptor(request);
          descriptor.labels.forEach(label => {
            console.log(`  ${label.key} (${label.valueType}) - ${label.description}`);
          });
          console.log('===> created target_language metrics <===');
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
            name: client.projectPath(projectId),
            timeSeries: [timeSeriesData],
          };
          
          // Writes time series data
          const result = await client.createTimeSeries(request);
          console.log(`Done writing time series data.`, result);
    }
}
module.exports = MetricsManager;