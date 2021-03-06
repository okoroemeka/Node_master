const environments = {};

environments.staging = {
  httpPort: 9000,
  httpsPort: 8000,
  envName: 'staging',
};

environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: 'production',
};

const { NODE_ENV } = process.env;
const currentEnvironment =
  typeof NODE_ENV == 'string' ? NODE_ENV.toLowerCase() : '';

const environmentsToExport =
  typeof environments[currentEnvironment] == 'object'
    ? environments[currentEnvironment]
    : environments.staging;

module.exports = environmentsToExport;
