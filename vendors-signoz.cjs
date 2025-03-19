const signozLogsUrl = "https://ingest.us.staging.signoz.cloud:443/v1/logs";
const signozIngestionKey = process.env.SIGNOZ_INGESTION_KEY;
const signozServiceName = "test-nodejs-service";

module.exports = {
    signozLogsUrl: signozLogsUrl,
    signozIngestionKey: signozIngestionKey,
    signozServiceName: signozServiceName
};