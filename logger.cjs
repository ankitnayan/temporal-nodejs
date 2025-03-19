const logsAPI = require('@opentelemetry/api-logs');
const winston = require('winston');
const { Console } = require('winston/lib/winston/transports');
const { LoggerProvider, SimpleLogRecordProcessor } = require('@opentelemetry/sdk-logs');
const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
const { OpenTelemetryTransportV3 } = require('@opentelemetry/winston-transport');
const { resourceFromAttributes } = require('@opentelemetry/resources');

const { signozLogsUrl, signozIngestionKey, signozServiceName } = require('./vendors-signoz.cjs');

// NOTE: https://signoz.io/docs/logs-management/send-logs/nodejs-winston-logs/

const { version } = require('./package.json');

const environment = process.env.ENVIRONMENT || 'development';

const logLevel = process.env.LOG_LEVEL || 'info';

const otlpExporter = new OTLPLogExporter({
    headers: { 'signoz-access-token': signozIngestionKey },
    url: signozLogsUrl,
});

const loggerProvider = new LoggerProvider({
        resource: new resourceFromAttributes({
            'service.name': signozServiceName,
            'service.version': version,
            'deployment.environment': environment,
        }),
});

// Add processor with the OTLP exporter
loggerProvider.addLogRecordProcessor(new SimpleLogRecordProcessor(otlpExporter));

// Set the global logger provider
logsAPI.logs.setGlobalLoggerProvider(loggerProvider);

const openTelemetryTransport = new OpenTelemetryTransportV3({
    // @ts-ignore - https://signoz.io/docs/logs-management/send-logs/nodejs-winston-logs/
    loggerProvider,
    logAttributes: {
        'service.name': signozServiceName,
        'deployment.environment': environment,
    },
    // @ts-ignore - https://signoz.io/docs/logs-management/send-logs/nodejs-winston-logs/
});

// NOTE: winston.transports.Console does not works with Jiti compiler which is what GraphQL codegen uses
const consoleTransport = new Console();

module.exports = winston.createLogger(
    {
        level: logLevel,
        format: winston.format.combine(
            winston.format.errors({ stack: true }),
            winston.format.json(),
            winston.format.metadata(),
            winston.format.timestamp(),
        ),
        defaultMeta: {
            environment,
            service: signozServiceName,
        },
        transports: [ consoleTransport, openTelemetryTransport],
    }
);