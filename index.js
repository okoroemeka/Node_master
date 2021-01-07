const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');

const requestHandler = function (req, res) {
  unifiedServer(req, res);
};

const httpServer = http.createServer(requestHandler);

const serverOptions = {
  key: fs.readFileSync('./https/key.pem'),
  cert: fs.readFileSync('./https/cert.pem'),
};

const httpsServer = https.createServer(serverOptions, requestHandler);

const unifiedServer = function (req, res) {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');
  const queryString = parsedUrl.query;
  const method = req.method.toUpperCase();
  const headers = req.headers;
  const decoder = new StringDecoder('utf-8');
  let buffer = '';

  req.on('data', (data) => {
    buffer += decoder.write(data);
  });

  req.on('end', () => {
    buffer += decoder.end();

    const chosenHandler =
      typeof router[trimmedPath] !== 'undefined'
        ? router[trimmedPath]
        : handler.notFound;

    const data = {
      trimmedPath,
      queryStringObject: queryString,
      method,
      headers,
      payload: buffer,
    };

    chosenHandler(data, function (statusCode, payload) {
      statusCode = typeof statusCode === 'number' ? statusCode : 200;
      payload = typeof payload === 'object' ? payload : {};
      const payloadString = JSON.stringify(payload);

      res.writeHead(statusCode);
      res.end(payloadString);

      console.log('Returning this response', statusCode, payloadString);
    });
  });
};
const handler = {};

handler.notFound = function (data, callback) {
  callback(404);
};

handler.ping = function (data, callback) {
  callback(200);
};

const router = {
  ping: handler.ping,
};

httpServer.listen(config.port, () =>
  console.log(`the server is listening on port ${config.httpPort}`)
);

httpsServer.listen(config.port, () =>
  console.log(`the server is listening on port ${config.httpsPort}`)
);
