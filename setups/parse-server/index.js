require('dotenv').config();
const express = require('express');
const { default: ParseServer, ParseGraphQLServer } = require('parse-server');

const app = express();

const parseServer = new ParseServer({
  databaseURI: process.env.DATABASE_URI || 'mongodb://localhost:27017/test',
  appId: process.env.APPLICATION_ID || 'APPLICATION_ID',
  masterKey: process.env.MASTER_KEY || 'MASTER_KEY',
  restApiKey: process.env.REST_API_KEY || 'REST_API_KEY',
  serverURL: `${process.env.SERVER_URL}/parse` || 'http://localhost:1337/parse',
  publicServerURL: `${process.env.PUBLIC_URL}/parse` || 'http://localhost:1337/parse',
  masterKeyIPs: typeof process.env.PARSE_SERVER_MASTER_KEY_IPS === 'string' ? process.env.PARSE_SERVER_MASTER_KEY_IPS.split(',') : ['0.0.0.0/0']
});

const parseGraphQLServer = new ParseGraphQLServer(
  parseServer,
  {
    graphQLPath: '/graphql',
    playgroundPath: '/playground'
  }
);

app.use('/parse', parseServer.app); // (Optional) Mounts the REST API
parseGraphQLServer.applyGraphQL(app); // Mounts the GraphQL API
parseGraphQLServer.applyPlayground(app); // (Optional) Mounts the GraphQL Playground - do NOT use in Production

parseServer.start().then(() => {
  app.listen(process.env.PORT, function() {
    console.log(`REST API running on ${process.env.SERVER_URL}/parse`);
    console.log(`GraphQL API running on ${process.env.SERVER_URL}/graphql`);
    console.log(`GraphQL Playground running on ${process.env.SERVER_URL}:${process.env.PORT}/playground`);
    console.log(`masterKeyIPs: ${typeof process.env.PARSE_SERVER_MASTER_KEY_IPS === "string" ? process.env.PARSE_SERVER_MASTER_KEY_IPS.split(',') : ['127.0.0.1', '::1']}`)
  });
});
