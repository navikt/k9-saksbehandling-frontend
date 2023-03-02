const express = require('express');
const path = require('path');
const helmet = require('helmet');
const server = express();

const OIDC_AUTH_PROXY_URL = process.env.OIDC_AUTH_PROXY_URL;
server.use(helmet({ contentSecurityPolicy: false })); // CSP settes i meta-tagger av CspHtmlWebpackPlugin

server.use(express.static(path.join(__dirname, 'build')));

const PORT = process.env.PORT || 8090;

server.get('/isAlive', (req, res) => res.sendStatus(200));
server.get('/isReady', (req, res) => res.sendStatus(200));
server.get('/localapi/env', (req, res) => res.json({ OIDC_AUTH_PROXY_URL }));

server.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

server.listen(PORT, error => {
  if (error) {
    console.log(error);
    return;
  }

  console.log('Started express server at port ' + PORT);
});
