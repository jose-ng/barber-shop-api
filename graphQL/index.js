const { ApolloServer } = require('@apollo/server');
const {
  ApolloServerPluginLandingPageLocalDefault,
} = require('@apollo/server/plugin/landingPage/default');
const { expressMiddleware } = require('@apollo/server/express4');

const { loadFilesSync } = require('@graphql-tools/load-files');
const resolvers = require('./resolvers');
const {
  typeDefs: typeDefsScalars,
  resolvers: resolversScalars,
} = require('graphql-scalars');

const useGraphQL = async (app) => {
  const typeDefs = [...loadFilesSync('./**/*.graphql'), typeDefsScalars];
  const allResolvers = [resolvers, resolversScalars];

  const server = new ApolloServer({
    typeDefs,
    resolvers: allResolvers,
    playground: true,
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({ footer: false }),
    ],
  });

  await server.start();

  app.use(
    '/graphql',
    expressMiddleware(server)
  );
};

module.exports = useGraphQL;
