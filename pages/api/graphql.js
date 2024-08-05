import GraphQLJSON from "graphql-type-json";
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";

import typeDefs from "../../lib/apollo/schema";
import { dateScalar } from "../../lib/apollo/scalars";
import queryResolvers from "../../lib/apollo/resolvers";

const resolvers = {
  JSON: GraphQLJSON,
  Date: dateScalar,

  Query: { ...queryResolvers },
};

const server = new ApolloServer({
  resolvers,
  typeDefs,
  formatError: (err) => ({
    message: err.message,
    locations: err.locations,
    path: err.path,
  }),
  introspection: process.env.NODE_ENV !== "production",
  playground: process.env.NODE_ENV !== "production",
  debug: process.env.NODE_ENV !== "production",
});

export default startServerAndCreateNextHandler(server, {
  context: async ({ req, res }) => {
    return true;
  },
});
