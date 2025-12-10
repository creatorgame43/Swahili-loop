const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'https://ingest.kubiks.app/v1/traces',
    headers: {
      'x-kubiks-key': process.env.OTEL_EXPORTER_OTLP_HEADERS || process.env.KUBIKS_API_KEY || ''
    }
  }),
  instrumentations: [getNodeAutoInstrumentations()],
  serviceName: process.env.OTEL_SERVICE_NAME || 'swahili-loop',
  serviceVersion: '1.0.0',
});

sdk.start();
console.log('🔍 OpenTelemetry Instrumentation Started');

process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('OpenTelemetry shutdown'))
    .catch((err) => console.log('Error shutting down OpenTelemetry', err))
    .finally(() => process.exit(0));
});
