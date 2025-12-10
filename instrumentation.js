const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'https://ingest.kubiks.app/v1/traces',
    headers: {
      'x-kubiks-key': process.env.OTEL_EXPORTER_OTLP_HEADERS?.split('=')[1] || '',
    },
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

console.log('OpenTelemetry initialized');
