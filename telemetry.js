const { trace } = require('@opentelemetry/api');

const tracer = trace.getTracer('swahili-loop-tracer', '1.0.0');

module.exports = { tracer };
